---
title: 'Testing the rendering system'
description: 'A comprehensive test of markdown and MDX features for blog posts'
author: Aayushmaan Soni
pubDatetime: 2025-03-15T10:30:00Z
featured: false
draft: false
tags:
  - testing
  - markdown
  - mdx
  - development
slug: test-kitchen-sink
---

## Table of contents

This post exists to verify that all common blog elements render correctly. It covers typography, code blocks, lists, tables, and custom components.

## Basic text formatting

Regular paragraphs should have proper spacing and line height. This is a second sentence in the same paragraph to demonstrate flow.

You can use **bold text** for emphasis, _italic text_ for subtle stress, and **_bold italic_** when you really need both. Sometimes you need to show ~~incorrect information~~ with strikethrough.

Inline code like `const value = 42` should be distinguishable from regular text. The `<kbd>` element shows keyboard shortcuts: press <kbd>Cmd</kbd>+<kbd>K</kbd> to search.

## Code examples

Here's a TypeScript example:

```js file="src\data\blog\kitchen-sink.md"
// [!code highlight:4]
interface Config {
  port: number;
  host: string;
}

function createServer(config: Config): void {
  // [!code --:1]
  console.log(`Starting server on ${config.host}:${config.port}`);
  // [!code ++:1]
  console.log(`🚀 Server running at ${config.host}:${config.port}`);
}
```

And a bash command:

```bash
#!/bin/bash
find . -name "*.log" -mtime +7 -delete
```

## Lists and structure

Unordered list with nesting:

- First item
- Second item with details
  - Nested item one
  - Nested item two
    - Deeply nested
- Third item

Ordered list:

1. Initial step
2. Secondary step
3. Final step

## Tables

| Feature     | Status | Notes               |
| ----------- | ------ | ------------------- |
| Headings    | ✓      | H2 through H5       |
| Code blocks | ✓      | Syntax highlighting |
| Tables      | ✓      | Basic formatting    |

## Blockquotes and callouts

> This is a blockquote. It's useful for highlighting important information or quoting external sources. Multiple lines are supported naturally.

<Callout type="info">
  This is an informational callout. Use it for helpful tips or additional
  context that supplements the main content.
</Callout>

<Callout type="warning">
  Warning callouts draw attention to potential issues or important caveats
  readers should know about.
</Callout>

### Deeper heading levels

#### Level 4 heading

This is content under a level 4 heading.

##### Level 5 heading

And this is content under level 5.

## Images and media

![A placeholder image demonstrating alt text](https://placehold.co/600x400)

---

## Interactive elements

<details>
<summary>Click to expand</summary>

Hidden content that reveals on interaction. Useful for optional details, code examples, or supplementary information that shouldn't clutter the main flow.

</details>

<Note>
  Notes provide contextual information without interrupting the reading flow.
</Note>

## Links and references

Internal navigation: [Go to the testing section](#basic-text-formatting)

External resource: [MDX Documentation](https://mdxjs.com)

## Footnotes

This statement needs a citation[^1]. Here's another reference[^2].

[^1]: First footnote with supporting information.

[^2]: Second footnote providing additional context.

---

The elements above should render consistently across different devices and screen sizes. If something looks broken, check the rendering pipeline configuration.
