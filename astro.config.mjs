import { defineConfig, envField } from 'astro/config';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { loadEnv } from 'vite';
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
import vercel from '@astrojs/vercel/serverless';
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL,
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

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
    ],
    shikiConfig: {
      themes: { light: 'min-light', dark: 'night-owl' },
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
      RESEND_API_KEY: envField.string({
        access: 'secret',
        context: 'server',
      }),
      RESEND_AUDIENCE_ID: envField.string({
        access: 'secret',
        context: 'server',
      }),
      UPSTASH_REDIS_REST_URL: envField.string({
        access: 'secret',
        context: 'server',
      }),
      UPSTASH_REDIS_REST_TOKEN: envField.string({
        access: 'secret',
        context: 'server',
      }),
      QSTASH_URL: envField.string({
        access: 'secret',
        context: 'server',
      }),
      QSTASH_TOKEN: envField.string({
        access: 'secret',
        context: 'server',
      }),
      QSTASH_CURRENT_SIGNING_KEY: envField.string({
        access: 'secret',
        context: 'server',
      }),
      QSTASH_NEXT_SIGNING_KEY: envField.string({
        access: 'secret',
        context: 'server',
      }),
      GITHUB_WORKFLOW_TOKEN: envField.string({
        access: 'secret',
        context: 'server',
      }),
      GITHUB_WORKFLOW_REPO: envField.string({
        access: 'secret',
        context: 'server',
      }),
      VERCEL_WEBHOOK_SECRET: envField.string({
        access: 'secret',
        context: 'server',
      }),
      INTERNAL_SYNC_SECRET: envField.string({
        access: 'secret',
        context: 'server',
      }),
    },
  },

  experimental: {
    preserveScriptOrder: true,
  },
});
