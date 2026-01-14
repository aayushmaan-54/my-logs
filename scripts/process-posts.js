import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { Redis } from '@upstash/redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple frontmatter parser
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: content };
  }

  const frontmatterText = match[1];
  const body = match[2];
  const frontmatter = {};

  // Parse YAML-like frontmatter (simplified)
  for (const line of frontmatterText.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse boolean
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    // Parse array (simple case: ['item1', 'item2'])
    else if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
    }
    // Parse date
    else if (key.includes('datetime') || key.includes('date')) {
      try {
        value = new Date(value);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    frontmatter[key] = value;
  }

  return { frontmatter, content: body };
}

function getPostId(filePath) {
  // Convert file path to postId
  // e.g., src/content/writing/blogs/test.md -> blogs/test
  // e.g., src/content/writing/short-reads/test.md -> short-reads/test
  const relativePath = filePath
    .replace(/^.*src\/content\/writing\//, '')
    .replace(/\.(md|mdx)$/, '');
  return relativePath;
}

function determineCollection(filePath) {
  if (filePath.includes('/short-reads/')) {
    return 'short_reads';
  }
  return 'blogs';
}

function isPostPublished(metadata) {
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

async function processPost(filePath, redis) {
  try {
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return null;
    }

    const content = readFileSync(filePath, 'utf-8');
    const { frontmatter } = parseFrontmatter(content);

    if (!frontmatter.title) {
      console.warn(`Skipping ${filePath}: no title found`);
      return null;
    }

    const collection = determineCollection(filePath);
    const postId = getPostId(filePath);

    // Check if already exists in Redis
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
    return {
      postId,
      filePath,
      collection,
      slug,
      title: frontmatter.title,
      description,
      publishedAt: pubDate.toISOString(),
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

async function main() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN');
    process.exit(1);
  }

  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  // Get changed files from environment or command line args
  const changedFiles = process.env.CHANGED_FILES
    ? JSON.parse(process.env.CHANGED_FILES)
    : process.argv.slice(2);

  if (!changedFiles || changedFiles.length === 0) {
    console.log('No files to process');
    return;
  }

  console.log(`Processing ${changedFiles.length} file(s)...`);

  const processedPosts = [];
  for (const file of changedFiles) {
    const postMeta = await processPost(file, redis);
    if (postMeta) {
      processedPosts.push(postMeta);
    }
  }

  // Store last_sent marker (timestamp of when we last processed posts)
  if (processedPosts.length > 0) {
    await redis.set('email:last_processed', new Date().toISOString());
    console.log(`\n✓ Processed ${processedPosts.length} new post(s)`);
    console.log(`✓ Updated last_processed timestamp`);
  } else {
    console.log('\nNo new published posts to process');
  }
}

main().catch(console.error);
