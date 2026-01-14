import redis from './redis';

export default async function logPostEvent(
  postId: string,
  event: string,
  metadata?: Record<string, unknown>,
) {
  await redis.lpush(
    `post:${postId}:events`,
    JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      ...metadata,
    }),
  );

  await redis.ltrim(`post:${postId}:events`, 0, 49);
}
