export const prerender = false;

import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';
import {
  INTERNAL_SYNC_SECRET,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
} from 'astro:env/server';

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${INTERNAL_SYNC_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { files } = await request.json();

    for (const filePath of files) {
      const slug = filePath.split('/').pop().split('.')[0];

      const exists = await redis.exists(`post:${slug}`);
      if (!exists) {
        await redis.set(`post:${slug}`, {
          slug,
          emailStatus: 'pending',
          createdAt: new Date().toISOString(),
        });
        console.log(`Initialized tracking for: ${slug}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
