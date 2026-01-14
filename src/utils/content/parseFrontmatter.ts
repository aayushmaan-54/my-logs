import matter from 'gray-matter';

export default function parseFrontmatter(fileContent: string) {
  try {
    const { data, content } = matter(fileContent);

    return {
      frontmatter: data,
      content: content.trim()
    };
  } catch (error) {
    console.error("Failed to parse MDX frontmatter:", error);
    return { frontmatter: {}, content: fileContent };
  }
}
