export const prerender = false;

import type { APIRoute } from 'astro';
import redis from '@/lib/redis/redis';
import getPostMeta from '@/lib/redis/getPostMeta';
import getCancellationFlag from '@/lib/redis/getCancellationFlag';

export const GET: APIRoute = async ({ url }) => {
  const postId = url.searchParams.get('postId');

  if (!postId) {
    return new Response(
      JSON.stringify({ error: 'postId query param required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const post = await getPostMeta(postId);
    const isCancelled = await getCancellationFlag(postId);
    const events = await redis.lrange(`post:${postId}:events`, 0, 10);

    return new Response(
      JSON.stringify({
        ...post,
        cancellationFlag: isCancelled,
        recentEvents: events.map(e =>
          typeof e === 'string' ? JSON.parse(e) : e
        ),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
