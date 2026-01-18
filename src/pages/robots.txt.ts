import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL, llmsTxtURL: URL) => `
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
Sitemap: ${llmsTxtURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  const llmsTxtURL = new URL('llms.txt', site);
  return new Response(getRobotsTxt(sitemapURL, llmsTxtURL), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
