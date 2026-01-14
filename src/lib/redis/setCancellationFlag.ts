import redis from './redis';

export default async function setCancellationFlag(
  postId: string,
  cancelled: boolean
) {
  await redis.set(`email:cancel:${postId}`, cancelled ? 'true' : 'false');
}
