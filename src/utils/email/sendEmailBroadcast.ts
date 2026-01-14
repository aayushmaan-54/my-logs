import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const sendEmailBroadcast = async ({
  audienceId,
  subject,
  html,
}: {
  audienceId: string;
  subject: string;
  html: string;
}) => {
  const { data: broadcast, error: createError } =
    await resend.broadcasts.create({
      audienceId,
      from: 'My Logs <subscribe@aayushmaan.me>',
      subject,
      html,
    });

  if (createError || !broadcast) {
    console.error('Failed to create broadcast:', createError);
    return;
  }

  const { data, error } = await resend.broadcasts.send(broadcast.id);

  if (error) {
    console.error('Failed to send broadcast:', error);
    return;
  }

  console.log('Email broadcast sent successfully:', data);

  return { data, error };
};

export default sendEmailBroadcast;
