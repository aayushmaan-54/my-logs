export default function getReadingTime(text: string, wpm = 200) {
  let content = text;

  // Remove frontmatter (YAML/TOML)
  content = content.replace(/^---[\s\S]*?---/m, "");
  content = content.replace(/^\+\+\+[\s\S]*?\+\+\+/m, "");

  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, "");

  // Remove inline code (fixed regex)
  content = content.replace(/`[^`]*`/g, "");

  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, "");

  // Remove MDX/HTML tags
  content = content.replace(/<[^>]*>/g, "");

  // Remove images
  content = content.replace(/!\[([^\]]*)\]\([^\)]+\)/g, "");

  // Remove markdown links but keep text
  content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

  // Remove headings markers
  content = content.replace(/^#{1,6}\s+/gm, "");

  // Remove emphasis markers (bold, italic, strikethrough)
  content = content.replace(/[*_~]{1,3}/g, "");

  // Remove list markers
  content = content.replace(/^\s*[-*+]\s+/gm, "");
  content = content.replace(/^\s*\d+\.\s+/gm, "");

  // Remove blockquote markers
  content = content.replace(/^\s*>\s+/gm, "");

  // Remove horizontal rules
  content = content.replace(/^[-*_]{3,}$/gm, "");

  // Count words
  const words = content
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const minutes = Math.max(1, Math.ceil(words / wpm));

  return minutes;
}
