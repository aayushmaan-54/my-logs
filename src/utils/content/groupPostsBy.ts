import type { CollectionEntry } from 'astro:content';

type GroupKey = string | number | symbol;

interface GroupFunction<T> {
  (item: T, index?: number): GroupKey;
}

const groupPostsBy = (
  posts: CollectionEntry<'blogs' | 'short_reads'>[],
  groupFunction: GroupFunction<CollectionEntry<'blogs' | 'short_reads'>>,
) => {
  const result: Record<GroupKey, CollectionEntry<'blogs' | 'short_reads'>[]> =
    {};

  for (let i = 0; i < posts.length; i++) {
    const item = posts[i];
    const groupKey = groupFunction(item, i);

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);
  }

  return result;
};

export default groupPostsBy;
