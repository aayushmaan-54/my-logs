import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import generateOgImageForPost from '@/utils/seo/generateOgImageForPost';
import { SITE } from '@/site.config';
import getPostPath from '@/utils/getPostPath';

export async function getStaticPaths() {
  if (!SITE.dynamicOgImage) return [];

  const blogs = await getCollection('blogs').then(blog =>
    blog.filter(({ data }) => !data.draft && !data.ogImage),
  );

  const routes = blogs.map(blog => {
    const fullPath = getPostPath(
      blog.id,
      blog.filePath,
      blog.collection,
      blog.data.slug,
    );

    const slug = fullPath.replace('/blogs/', '');

    return {
      params: {
        slug,
      },
      props: { blog },
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
    props.blog as CollectionEntry<'blogs'>,
  );
  return new Response(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'image/png' },
  });
};
