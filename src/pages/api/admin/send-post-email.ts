export const prerender = false;

import type { APIRoute } from 'astro';
import { Receiver } from '@upstash/qstash';
import {
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
} from 'astro:env/server';
import getCancellationFlag from '@/lib/redis/getCancellationFlag';
import getPostMeta from '@/lib/redis/getPostMeta';
import sendPostEmailBroadcast from '@/lib/sendPostEmailBroadcast';
import logPostEvent from '@/lib/redis/logPostEvent';

const receiver = new Receiver({
  currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: QSTASH_NEXT_SIGNING_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const signature = request.headers.get('upstash-signature') ?? '';
    const url = request.url;

    const isValid = await receiver.verify({
      signature,
      body,
      url,
    });

    if (!isValid) {
      return new Response('Invalid signature', { status: 401 });
    }

    const { postId } = JSON.parse(body);

    if (!postId) {
      return new Response('Missing postId', { status: 400 });
    }

    const isCancelled = await getCancellationFlag(postId);
    if (isCancelled) {
      console.log(`Email for ${postId} was cancelled, skipping...`);
      return new Response(
        JSON.stringify({ skipped: true, reason: 'cancelled' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const post = await getPostMeta(postId);
    if (post.emailStatus === 'sent') {
      console.log(`Email for ${postId} already sent, skipping...`);
      return new Response(
        JSON.stringify({ skipped: true, reason: 'already_sent' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (post.emailStatus === 'cancelled') {
      console.log(`Email for ${postId} status is cancelled, skipping...`);
      return new Response(
        JSON.stringify({ skipped: true, reason: 'status_cancelled' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    await sendPostEmailBroadcast(postId);

    return new Response(JSON.stringify({ success: true, postId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Send email error:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
