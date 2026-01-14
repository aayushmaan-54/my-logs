import getPostPath from '@/utils/content/getPostPath';
import { PUBLIC_SITE_URL } from 'astro:env/client';
import type { postEmailMeta } from '@/lib/redis/redis.types';

const escapeHtml = (text: string = '') => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

const renderSendPostEmail = (post: postEmailMeta) => {
  const description =
    post.collection === 'short_reads'
      ? `Short reads: ${escapeHtml(post.title)} - ${post.publishedAt.toLocaleDateString()}`
      : escapeHtml(post.description);

  const postLink = getPostPath(
    post.postId,
    post.filePath,
    post.collection,
    post.slug,
  );

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="font-family: sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <h1 style="margin-top: 0;">New post: ${escapeHtml(post.title)}</h1>
        <p style="line-height: 1.6; color: #333;">${description}</p>
        <a href="${PUBLIC_SITE_URL}${postLink}" style="display: inline-block; margin-top: 10px; padding: 12px 24px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px;">Read the full post →</a>
      </div>
    </body>
    </html>
  `;
};

export default renderSendPostEmail;
