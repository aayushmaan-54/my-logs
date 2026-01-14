import redis from './redis';

export default async function markPostSentInRedis(postId: string) {
  await redis.hset(`post:${postId}`, {
    emailStatus: 'sent',
    sentAt: new Date().toISOString(),
  });
}
