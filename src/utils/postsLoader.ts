import type { BlogPost } from '../types/blog';

const postFiles = import.meta.glob('/src/posts/*.md', { eager: true, query: '?raw', import: 'default' });

function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatter: Record<string, unknown> = {};
  const lines = match[1].split('\n');
  let currentKey = '';
  let inArray = false;
  let arrayValues: string[] = [];

  for (const line of lines) {
    if (line.startsWith('  - ')) {
      arrayValues.push(line.slice(4).trim());
    } else if (line.includes(':')) {
      if (inArray && currentKey) {
        frontmatter[currentKey] = arrayValues;
        arrayValues = [];
        inArray = false;
      }
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      currentKey = key.trim();
      if (value === '') {
        inArray = true;
      } else {
        frontmatter[currentKey] = value;
      }
    }
  }

  if (inArray && currentKey) {
    frontmatter[currentKey] = arrayValues;
  }

  return { frontmatter, body: match[2] };
}

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, content] of Object.entries(postFiles)) {
    const { frontmatter, body } = parseFrontmatter(content as string);
    const slug = path.split('/').pop()?.replace('.md', '') || '';

    posts.push({
      id: slug,
      title: String(frontmatter.title || ''),
      slug: String(frontmatter.slug || slug),
      excerpt: String(frontmatter.excerpt || ''),
      content: body,
      publishedAt: String(frontmatter.publishedAt || new Date().toISOString()),
      updatedAt: String(frontmatter.updatedAt || frontmatter.publishedAt || new Date().toISOString()),
      readTime: Number(frontmatter.readTime) || Math.ceil(body.split(/\s+/).length / 200),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      author: {
        name: 'Daksh Sangal',
        avatar: `${import.meta.env.BASE_URL}/portfolio/avatar.jpeg`,
      },
      featured: Boolean(frontmatter.featured),
      status: 'published',
      coverImage: frontmatter.coverImage ? String(frontmatter.coverImage) : undefined,
    });
  }

  return posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find(p => p.slug === slug) || null;
}
