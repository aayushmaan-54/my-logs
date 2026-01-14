export const prerender = false;

import type { APIRoute } from 'astro';
import { INTERNAL_SYNC_SECRET, QSTASH_TOKEN } from 'astro:env/server';
import redis from '@/lib/redis/redis';
import getPostMeta from '@/lib/redis/getPostMeta';
import sendPostEmailBroadcast from '@/lib/sendPostEmailBroadcast';
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
      return new Response(JSON.stringify({ error: 'Email already sent' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (post.emailStatus === 'cancelled') {
      return new Response(JSON.stringify({ error: 'Email was cancelled' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (post.jobId) {
      try {
        await fetch(`https://qstash.upstash.io/v2/messages/${post.jobId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${QSTASH_TOKEN}` },
        });
        console.log(`Deleted scheduled QStash job: ${post.jobId}`);
      } catch (e) {
        console.warn('Failed to delete scheduled job:', e);
      }
    }

    await logPostEvent(postId, 'manual_send_triggered', {
      previousStatus: post.emailStatus,
    });

    await redis.hset(`post:${postId}`, {
      emailStatus: 'sending',
      sendingStartedAt: new Date().toISOString(),
      manualSend: 'true',
    });

    await sendPostEmailBroadcast(postId);

    await logPostEvent(postId, 'sent_manually', {
      title: post.title,
    });

    return new Response(
      JSON.stringify({ success: true, postId, sent: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Send now error:', error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
