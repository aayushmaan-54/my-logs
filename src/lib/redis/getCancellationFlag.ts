import redis from './redis';

export default async function getCancellationFlag(
  postId: string
): Promise<boolean> {
  const value = await redis.get(`email:cancel:${postId}`);
  return value === 'true';
}
