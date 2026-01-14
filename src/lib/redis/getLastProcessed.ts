import redis from './redis';

export default async function getLastProcessed(): Promise<Date | null> {
  const timestamp = await redis.get('email:last_processed');
  if (!timestamp) return null;
  return new Date(timestamp as string);
}
