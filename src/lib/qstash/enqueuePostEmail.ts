import qstash from './qstash';
import { PUBLIC_SITE_URL } from 'astro:env/client';
import schedulePostEmail from '@/lib/redis/schedulePostEmail';
import setCancellationFlag from '@/lib/redis/setCancellationFlag';

const DELAY = '1h';

export default async function enqueuePostEmail(postId: string) {
  const res = await qstash.publishJSON({
    url: `${PUBLIC_SITE_URL}/api/admin/send-post-email`,
    body: { postId },
    delay: DELAY,
  });

  const jobId = res.messageId;

  await schedulePostEmail(postId, jobId);
  await setCancellationFlag(postId, false);

  return { jobId, scheduledAt: new Date().toISOString() };
}
