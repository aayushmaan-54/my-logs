---
title: 'MDX Kitchen Sink: Everything This Blog Supports'
description: 'A single post to verify that all MDX components, typography, and content features render correctly.'
pubDatetime: 2004-05-05T04:45:00Z
tags: ['mdx', 'testing', 'astro', 'blog']
---

## Table of contents

This post exists for **one reason only**:
to verify that _every important MDX feature_ in this blog renders correctly.

If something looks broken here, it's broken everywhere.

---

## Headings

### H3 — Section Heading

#### H4 — Subsection

##### H5 — Small Heading

---

## Paragraphs & Typography

This is a normal paragraph.
It should have comfortable line-height, readable width, and no visual noise.

**Bold text**, _italic text_, **_bold italic_**, and ~~strikethrough~~ should all work.

Inline code like `const foo = bar()` should be readable and not overpowering.

> This is a blockquote.
> It should feel calm and intentional — not shouty.

---

## Links

- Internal link: [About page](/about/)
- External link: [Astro Docs](https://docs.astro.build)

Links should:

- be visually distinct
- have hover/focus states
- not feel spammy

---

## Lists

### Unordered list

- First item
- Second item
  - Nested item
  - Nested item
- Third item

### Ordered list

1. First step
2. Second step
3. Third step

---

## Code Blocks

### JavaScript

```ts
export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
```

### Bash

```bash
npm install astro
npm run dev
```

### Inline + block consistency

Use inline code like `npm run build` when appropriate,
and blocks only when needed.

---

## Tables

| Feature     | Supported | Notes                    |
| ----------- | --------- | ------------------------ |
| MDX         | ✅        | Required                 |
| Code blocks | ✅        | With syntax highlighting |
| Tables      | ✅        | Should not overflow      |
| Callouts    | ✅        | Optional                 |

Tables should:

- scroll horizontally on mobile
- not break layout

---

## Horizontal Rule

---

## Images

### Using Markdown Syntax (External/Public Images)

For external URLs or images in the `public/` folder, use standard markdown syntax:

![Example external image](https://placehold.co/600x400/0066CC/FFFFFF?text=External+Image)

![Example public image](/og-image.png)

### Using Astro Image Component (Local Assets - Recommended)

For local images in `src/assets/`, import and use the `<Image>` component for automatic optimization:

```mdx
---
import { Image } from 'astro:assets';
import heroImage from '../../assets/images/hero.jpg';
---

<Image src={heroImage} alt='Hero image' />
```

**Benefits of using `<Image>`:**

- ✅ Automatic WebP/AVIF conversion
- ✅ Responsive image generation
- ✅ Lazy loading
- ✅ No layout shift
- ✅ Better Core Web Vitals scores

**Note:** The `<img>` tag in MDX is automatically replaced with our optimized `MDXImage` component, which handles both external and local images intelligently.

Image expectations:

- responsive
- no layout shift
- alt text visible to screen readers

---

## Footnotes

This is a sentence with a footnote.[^1]

[^1]: This is the footnote text. It should render at the bottom.

---

## Details / Summary (if supported)

<details>
  <summary>Click to expand</summary>

Hidden content goes here.
Useful for side-notes or optional explanations.

</details>

---

## MDX Components (Optional but common)

If you support custom components, test them here.

### Callout

<Callout type="info">This is an informational callout.</Callout>

<Callout type="warning">This is a warning callout.</Callout>

### Note

<Note>This is a quiet note. Not everything needs to scream.</Note>

---

## Keyboard / Accessibility

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

---

## Emojis (subtle use)

This is acceptable 🙂
This is not 🚀🔥💯❌

---

## Final Section

If **this post renders perfectly**, then:

- Typography is correct
- MDX is configured properly
- Components are wired correctly
- Code highlighting works
- Layout is stable

This file should never be deleted.
Only updated when you add new features.

---

**End of kitchen sink.**
