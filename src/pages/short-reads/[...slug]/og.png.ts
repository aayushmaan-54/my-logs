import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import generateOgImageForPost from '@/utils/seo/generateOgImageForPost';
import { SITE } from '@/site.config';
import getPostPath from '@/utils/content/getPostPath';

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) return [];

  const shortReads = await getCollection('short_reads').then(blog =>
    blog.filter(({ data }) => !data.draft),
  );

  const routes = shortReads.map(shortRead => {
    const fullPath = getPostPath(
      shortRead.id,
      shortRead.filePath,
      shortRead.collection,
      shortRead.data.slug,
    );

    const slug = fullPath.replace('/short-reads/', '');

    return {
      params: {
        slug,
      },
      props: { shortRead },
    };
  });

  return routes;
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }

  const buffer = await generateOgImageForPost(
    props.shortRead as CollectionEntry<'short_reads'>,
  );
  return new Response(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'image/png' },
  });
};
