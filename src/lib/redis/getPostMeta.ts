import redis from './redis';
import type { postEmailMeta } from './redis.types';

export default async function getPostMeta(
  postId: string,
): Promise<postEmailMeta> {
  const post = (await redis.hgetall(
    `post:${postId}`,
  )) as unknown as Record<string, any>;

  if (!post || Object.keys(post).length === 0)
    throw new Error(`Post not found: ${postId}`);

  return {
    ...post,
    publishedAt: post.publishedAt instanceof Date
      ? post.publishedAt
      : new Date(post.publishedAt),
  } as postEmailMeta;
}
