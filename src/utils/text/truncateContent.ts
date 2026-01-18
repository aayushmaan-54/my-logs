export default function truncateContent(
  content: string,
  maxWords: number,
  readMoreUrl: string,
): string {
  const words = content.split(/\s+/).filter(word => word.length > 0);
  if (words.length <= maxWords) {
    return content + `\n\n→ Read more: ${readMoreUrl}`;
  }
  return (
    words.slice(0, maxWords).join(' ') + `...\n\n→ Read more: ${readMoreUrl}`
  );
}
