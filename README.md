# ToDo:

- use <Image> astro compoenet in mdx blogs we render
- Honeypot, rate limiting to subscribe and unsubscribe service

```jsx
Global mdx components
// src/mdx-components.ts
import Callout from "./components/Callout.astro";
import CodeBlock from "./components/CodeBlock.astro";

export const mdxComponents = {
  Callout,
  CodeBlock,
};
```

- Whenever we want to add env update astro.config.mjs file
- write blogs in /src/content/writing/\*
-

- ./scrips/process-posts not needed
- sync post wrong slug logic (/api/admin/sync-post)
- /api/admin/posts/sync
