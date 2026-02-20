# Blog Post Creation Guide

## How to Add a New Post

1. **Create a new markdown file** in `src/posts/` directory
2. **Use this template**:

```markdown
---
title: Your Post Title
slug: your-post-slug
excerpt: A brief description of your post
publishedAt: 2024-01-01
updatedAt: 2024-01-01
readTime: 5
tags:
  - tag1
  - tag2
  - tag3
featured: false
---

# Your Post Title

Your content here in markdown...
```

## Frontmatter Fields

Required:
- `title`: Post title
- `slug`: URL-friendly slug (auto-generated if not provided)
- `publishedAt`: Publication date (YYYY-MM-DD)

Optional:
- `excerpt`: Brief description (auto-generated if not provided)
- `updatedAt`: Last update date (defaults to publishedAt)
- `readTime`: Read time in minutes (auto-calculated if not provided)
- `tags`: Array of tags
- `featured`: Boolean for featured posts
- `coverImage`: URL for cover image

## Workflow

1. Write your post in any markdown editor
2. Add frontmatter metadata
3. Place file in `src/posts/`
4. Commit and push to update the site

The site will automatically detect and display your new post!

## Examples

See existing posts in `src/posts/` for reference.
