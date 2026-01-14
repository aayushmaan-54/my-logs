import renderSendPostEmail from '@/utils/email/renderSendPostEmail';
import sendEmailBroadcast from '@/utils/email/sendEmailBroadcast';
import { RESEND_AUDIENCE_ID } from 'astro:env/server';
import redis from './redis/redis';
import getRedisPostMeta from './redis/getPostMeta';
import markPostSentInRedis from './redis/markPostSent';
import logPostEvent from './redis/logPostEvent';

const sendPostEmailBroadcast = async (postId: string) => {
  await redis.hset(`post:${postId}`, {
    emailStatus: 'sending',
    sendingStartedAt: new Date().toISOString(),
  });
  await logPostEvent(postId, 'sending_started');

  const isNew = await redis.setnx(`email:sent:${postId}`, 'true');
  if (!isNew) {
    await logPostEvent(postId, 'skipped_duplicate');
    return;
  }

  const post = await getRedisPostMeta(postId);

  const sendEmailRes = await sendEmailBroadcast({
    audienceId: RESEND_AUDIENCE_ID,
    subject: `New post from My Logs: ${post.title}`,
    html: renderSendPostEmail(post),
  });

  if (sendEmailRes?.error) {
    await logPostEvent(postId, 'error sending email', {
      error: sendEmailRes.error,
    });
    return;
  }

  await markPostSentInRedis(postId);
  await logPostEvent(postId, 'sent', { id: post.postId, title: post.title });
};

export default sendPostEmailBroadcast;
