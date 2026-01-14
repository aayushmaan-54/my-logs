export const prerender = false;

import type { APIRoute } from 'astro';
import { INTERNAL_SYNC_SECRET, QSTASH_TOKEN } from 'astro:env/server';
import redis from '@/lib/redis/redis';
import getPostMeta from '@/lib/redis/getPostMeta';
import setCancellationFlag from '@/lib/redis/setCancellationFlag';
import logPostEvent from '@/lib/redis/logPostEvent';

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${INTERNAL_SYNC_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { postId } = await request.json();

    if (!postId) {
      return new Response(JSON.stringify({ error: 'postId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let post;
    try {
      post = await getPostMeta(postId);
    } catch {
      return new Response(
        JSON.stringify({ error: `Post not found: ${postId}` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (post.emailStatus === 'sent') {
      return new Response(
        JSON.stringify({ error: 'Email already sent, cannot cancel' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await setCancellationFlag(postId, true);

    await redis.hset(`post:${postId}`, {
      emailStatus: 'cancelled',
      cancelledAt: new Date().toISOString(),
    });

    if (post.jobId) {
      try {
        const res = await fetch(
          `https://qstash.upstash.io/v2/messages/${post.jobId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${QSTASH_TOKEN}`,
            },
          }
        );
        if (res.ok) {
          console.log(`Deleted QStash job: ${post.jobId}`);
        } else {
          console.warn(`QStash job deletion returned: ${res.status}`);
        }
      } catch (e) {
        console.warn(`Failed to delete QStash job: ${post.jobId}`, e);
      }
    }

    await logPostEvent(postId, 'cancelled', {
      previousStatus: post.emailStatus,
      deletedJobId: post.jobId,
    });

    return new Response(
      JSON.stringify({ success: true, postId, status: 'cancelled' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Cancel email error:', error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
