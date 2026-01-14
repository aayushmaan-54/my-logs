export const prerender = false;

import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import redis from '@/lib/redis/redis';
import enqueuePostEmail from '@/lib/qstash/enqueuePostEmail';
import parseFrontmatter from '@/utils/content/parseFrontmatter';


function getPostId(filePath: string): string {
  const relativePath = filePath
    .replace(/^.*src\/content\/writing\//, '')
    .replace(/\.(md|mdx)$/, '');
  return relativePath;
}

function determineCollection(filePath: string): 'blogs' | 'short_reads' {
  if (filePath.includes('/short-reads/')) {
    return 'short_reads';
  }
  return 'blogs';
}

function isPostPublished(metadata: Record<string, any>): boolean {
  const isDraft = metadata.draft === true || metadata.draft === 'true';
  if (isDraft) return false;

  const pubDate = metadata.pubDatetime;
  if (!pubDate) return false;

  const pubDateTime = pubDate instanceof Date ? pubDate : new Date(pubDate);
  const now = new Date();

  // Add 15 minute margin (scheduledPostMargin)
  const margin = 15 * 60 * 1000;
  return pubDateTime.getTime() <= (now.getTime() + margin);
}

async function processPost(filePath: string) {
  try {
    const fullPath = join(process.cwd(), filePath);

    if (!existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return null;
    }

    const content = readFileSync(fullPath, 'utf-8');
    const { frontmatter } = parseFrontmatter(content);

    if (!frontmatter.title) {
      console.warn(`Skipping ${filePath}: no title found`);
      return null;
    }

    const collection = determineCollection(filePath);
    const postId = getPostId(filePath);

    const existing = await redis.hgetall(`post:${postId}`);
    if (existing && Object.keys(existing).length > 0) {
      console.log(`Post ${postId} already exists in Redis, skipping...`);
      return null;
    }

    if (!isPostPublished(frontmatter)) {
      console.log(`Skipping ${filePath}: not published (draft or future date)`);
      return null;
    }

    const pubDate = frontmatter.pubDatetime instanceof Date
      ? frontmatter.pubDatetime
      : new Date(frontmatter.pubDatetime);

    const slug = frontmatter.slug || postId.split('/').pop();
    const description = frontmatter.description ||
      (collection === 'short_reads'
        ? `${frontmatter.title} - ${pubDate.toLocaleDateString()}`
        : frontmatter.title);

    // Store in Redis (dates stored as ISO strings)
    await redis.hset(`post:${postId}`, {
      postId: postId,
      filePath: filePath,
      collection: collection,
      slug: slug,
      title: frontmatter.title,
      description: description,
      publishedAt: pubDate.toISOString(),
      emailStatus: 'pending',
    });

    console.log(`✓ Stored post metadata for: ${postId}`);

    // Enqueue delayed email job (1 hour delay)
    const { jobId, scheduledAt } = await enqueuePostEmail(postId);
    console.log(`✓ Scheduled email for ${postId} with jobId: ${jobId}`);

    return {
      postId,
      filePath,
      collection,
      slug,
      title: frontmatter.title,
      description,
      publishedAt: pubDate.toISOString(),
      jobId,
      scheduledAt,
    };
  } catch (error: any) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { files } = body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Files array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const processedPosts = [];
    for (const file of files) {
      const postMeta = await processPost(file);
      if (postMeta) {
        processedPosts.push(postMeta);
      }
    }

    // Store last_processed marker
    if (processedPosts.length > 0) {
      await redis.set('email:last_processed', new Date().toISOString());
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedPosts.length,
        posts: processedPosts,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Process posts error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
