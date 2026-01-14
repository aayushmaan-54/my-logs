import redis from './redis';
import type { postEmailMeta } from './redis.types';

export default async function createPostEmailMeta(meta: postEmailMeta) {
  await redis.hset(`post:${meta.postId}`, {
    postId: meta.postId,
    filePath: meta.filePath,
    collection: meta.collection,
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    publishedAt: meta.publishedAt,
    emailStatus: 'pending',
  });
}
