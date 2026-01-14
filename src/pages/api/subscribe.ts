import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_AUDIENCE_ID } from 'astro:env/server';
import validator from 'validator';
const { isEmail } = validator;
export const prerender = false;

const resend = new Resend(RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !isEmail(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await resend.contacts.create({
      email: email,
      audienceId: RESEND_AUDIENCE_ID,
    });

    if (response.error) {
      console.error('Resend error:', response.error);

      if (response.error.message?.includes('already exists')) {
        return new Response(
          JSON.stringify({ error: 'This email is already subscribed' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } },
        );
      }

      return new Response(JSON.stringify({ error: 'Failed to subscribe' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed!',
        contactId: response.data?.id,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
