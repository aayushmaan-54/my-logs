import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { RESEND_API_KEY } from 'astro:env/server';
import validator from 'validator';

const { isEmail } = validator;

export const prerender = false;

const resend = new Resend(RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !isEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const response = await resend.contacts.remove({
      email: normalizedEmail,
    });

    // Treat "not found" as success to avoid email enumeration
    if (
      response.error &&
      !response.error.message?.includes('not found') &&
      !response.error.message?.includes('does not exist')
    ) {
      return new Response(JSON.stringify({ error: 'Failed to unsubscribe' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'If this email was subscribed, it has now been unsubscribed.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
