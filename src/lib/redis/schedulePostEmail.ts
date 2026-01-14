import redis from './redis';

export default async function schedulePostEmail(postId: string, jobId: string) {
  await redis.hset(`post:${postId}`, {
    emailStatus: 'scheduled',
    scheduledAt: new Date().toISOString(),
    jobId,
  });
}
