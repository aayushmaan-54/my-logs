export const prerender = false;

import { triggerDeployWorkflow } from '@/lib/github/triggerDeployWorkflow';
import type { APIRoute } from 'astro';
import { VERCEL_WEBHOOK_SECRET } from 'astro:env/server';
import crypto from 'crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);
    const vercelSignature = request.headers.get('x-vercel-signature');

    if (!vercelSignature) {
      return new Response('Missing signature', { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac('sha1', VERCEL_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (vercelSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
      });
    }

    if (
      payload.type === 'deployment' &&
      payload.payload?.deployment?.state === 'READY'
    ) {
      await triggerDeployWorkflow({
        eventType: 'vercel-deploy-success',
        payload: {
          url: payload.payload.deployment.url,
          project: payload.payload.deployment.name,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};
