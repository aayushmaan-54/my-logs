import { defineConfig, envField } from 'astro/config';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { SITE } from './src/site.config';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import transformerFileName from './src/plugins/shiki-filename';
import remarkToc from 'remark-toc';
import rehypeExternalLinks from 'rehype-external-links';
import remarkCollapse from 'remark-collapse';
import { loadEnv } from 'vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkDefinitionList } from 'remark-definition-list';
import vercel from '@astrojs/vercel';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL,
  output: 'static',

  integrations: [
    icon(),
    mdx(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith('/archives'),
    }),
  ],

  markdown: {
    remarkPlugins: [
      [remarkToc, { maxDepth: 3, tight: true }],
      [remarkCollapse, { test: 'Table of contents' }],
      remarkMath,
      remarkDefinitionList,
    ],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
          content: { type: 'text', value: ' ↗' },
        },
      ],
      rehypeKatex,
    ],
    remarkRehype: {
      handlers: (await import('remark-definition-list')).defListHastHandlers,
    },
    shikiConfig: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName(),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: 'v3' }),
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },

  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },

  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: 'public',
        context: 'client',
        optional: true,
      }),
      PUBLIC_SITE_URL: envField.string({
        access: 'public',
        context: 'client',
      }),
    },
  },

  experimental: {
    preserveScriptOrder: true,
  },

  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
