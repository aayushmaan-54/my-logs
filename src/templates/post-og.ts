import satori from 'satori';
import { html } from 'satori-html';
import { type CollectionEntry } from 'astro:content';
import loadGoogleFontGlyphs from '@/utils/text/loadGoogleFontGlyphs';

export default async function generateSvg(
  post: CollectionEntry<'blogs' | 'short_reads'>,
) {
  const description =
    post.collection === 'blogs' && 'description' in post.data
      ? post.data.description
      : `${post.data.title} - ${post.data.pubDatetime.toLocaleDateString()}`;

  const markup = html` <div
    style="display: flex;"
    tw="h-[630px] w-[1200px] bg-[#f2f2f0] overflow-hidden"
  >
    <div style="display: flex;" tw="flex-col gap-10 px-20 py-18 h-full w-full">
      <div
        style="display: flex;"
        tw="h-[72px] w-[72px] items-center justify-center bg-[#1f2227] text-[40px] font-bold text-[#f2f2f0] border rounded-2xl"
      >
        /
      </div>

      <div style="display: flex;" tw="flex-1 flex-col gap-6">
        <h1
          style="display: flex;"
          tw="text-[64px] leading-[1.1] font-bold text-[#1f2227]"
        >
          ${post.data.title}
        </h1>

        <p
          style="display: flex;"
          tw="text-[28px] leading-[1.4] text-[#343b45bb]"
        >
          ${description}
        </p>
      </div>

      <div style="display: flex;" tw="mt-auto flex-col">
        <div
          style="display: flex;"
          tw="text-[22px] font-medium text-[#343b45bb]"
        >
          By ${post.data.author}
        </div>
        <div style="display: flex;" tw="text-[20px] text-[#6b7280]">
          ${import.meta.env.PUBLIC_SITE_URL}
        </div>
      </div>
    </div>
  </div>`;

  const fonts = await loadGoogleFontGlyphs(
    '/' +
      post.data.title +
      description +
      import.meta.env.PUBLIC_SITE_URL +
      'By' +
      post.data.author,
  );

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    embedFont: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fonts: fonts as any,
  });

  return svg;
}
