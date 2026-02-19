import type { BlogPost } from '../types/blog';

export const testPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building a Rich Text Editor from Scratch',
    slug: 'building-rich-text-editor',
    excerpt: 'Learn how to build a performant rich text editor using modern web technologies. We\'ll cover everything from contenteditable to custom block rendering.',
    content: `
# Building a Rich Text Editor from Scratch

Creating a rich text editor is one of the most challenging yet rewarding projects you can tackle. Let me walk you through my journey.

![Editor Interface](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80)

## Why Build Your Own?

Most developers reach for existing solutions like **Draft.js**, **Slate**, or **Quill**. These are fantastic tools, but sometimes you need something custom.

> The best editor is the one that fits your exact use case.

### Key Considerations

1. **Performance** - Must handle large documents
2. **Extensibility** - Easy to add custom blocks
3. **Collaboration** - Real-time editing support

## The Core Concepts

At its heart, a rich text editor is about:

- Managing a document model
- Rendering content efficiently
- Handling user input
- Applying formatting transformations

### Code Example

Here's a simple document structure:

\`\`\`typescript
interface Document {
  blocks: Block[];
  version: number;
}

interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'list';
  content: RichText[];
}
\`\`\`

## Performance Tips

- Use virtual scrolling for long documents
- Minimize re-renders with React.memo
- Debounce expensive operations

The key insight is to **separate the model from the view**. This makes your editor more maintainable and testable.

## Conclusion

Building your own editor is a great learning experience. Start simple, iterate, and don't be afraid to rewrite parts as you learn.
    `,
    publishedAt: '2026-02-15',
    updatedAt: '2026-02-15',
    readTime: 8,
    tags: ['React', 'TypeScript', 'Web Development'],
    author: {
      name: 'Your Name',
      avatar: '/avatar.jpg',
      bio: 'Full-stack developer passionate about developer tools'
    },
    featured: true
  },
  {
    id: '2',
    title: 'The Art of Clean Code',
    slug: 'art-of-clean-code',
    excerpt: 'Discover the principles that separate mediocre code from elegant, maintainable software. Clean code is not just about style—it\'s about communication.',
    content: `
# The Art of Clean Code

Clean code is more than just formatting. It's about crafting software that tells a story.

## The Philosophy

Code is read far more often than it's written. This simple truth should guide every decision you make.

### The Boy Scout Rule

Always leave the code better than you found it. Even small improvements compound over time.

## Naming Things

There are only two hard things in Computer Science:

1. Cache invalidation
2. Naming things
3. Off-by-one errors

Good names should:

- **Reveal intent** - What does this do?
- **Avoid disinformation** - Don't call it a list if it's not
- **Make meaningful distinctions** - Not \`data1\` and \`data2\`

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler

## Functions

Functions should:

- Be small (really small)
- Do one thing
- Have no side effects
- Use descriptive names

### Example

Bad:
\`\`\`javascript
function process(data) {
  // 100 lines of code doing multiple things
}
\`\`\`

Good:
\`\`\`javascript
function validateAndSaveUser(userData) {
  const validated = validateUser(userData);
  return saveToDatabase(validated);
}
\`\`\`

## Comments

The best comment is the one you didn't need to write. Code should be self-documenting.

When you do comment:
- Explain **why**, not what
- Keep them updated
- Avoid commented-out code

## Conclusion

Clean code is a journey, not a destination. It requires constant attention and practice.
    `,
    publishedAt: '2026-02-10',
    updatedAt: '2026-02-12',
    readTime: 6,
    tags: ['Best Practices', 'Software Engineering', 'Clean Code'],
    author: {
      name: 'Your Name',
      avatar: '/avatar.jpg'
    },
    featured: false
  },
  {
    id: '3',
    title: 'Modern CSS Techniques in 2026',
    slug: 'modern-css-2026',
    excerpt: 'Explore the latest CSS features that are changing how we build for the web. From container queries to the new color functions.',
    content: `
# Modern CSS Techniques in 2026

CSS has evolved dramatically. Let's explore the game-changing features available today.

## Container Queries

Finally! Style elements based on their container size, not just viewport.

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
\`\`\`

## CSS Nesting

Native CSS nesting is here. No preprocessors needed.

\`\`\`css
.card {
  padding: 1rem;
  
  & .title {
    font-size: 1.5rem;
    
    &:hover {
      color: blue;
    }
  }
}
\`\`\`

## Color Functions

Modern color manipulation:

- \`oklch()\` - Perceptually uniform colors
- \`color-mix()\` - Blend colors easily
- Relative color syntax

### Example

\`\`\`css
:root {
  --brand: oklch(70% 0.25 250);
  --brand-light: oklch(from var(--brand) 90% c h);
  --brand-dark: oklch(from var(--brand) 50% c h);
}
\`\`\`

## The :has() Selector

The "parent selector" we've been waiting for:

\`\`\`css
.card:has(img) {
  display: flex;
}

form:has(:invalid) {
  border-color: red;
}
\`\`\`

## View Transitions

Smooth page transitions with minimal code:

\`\`\`css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}
\`\`\`

## Conclusion

CSS is more powerful than ever. Embrace these features to build better, more maintainable interfaces.
    `,
    publishedAt: '2026-02-05',
    updatedAt: '2026-02-05',
    readTime: 5,
    tags: ['CSS', 'Web Development', 'Frontend'],
    author: {
      name: 'Your Name',
      avatar: '/avatar.jpg'
    },
    featured: false
  },
  {
    id: '4',
    title: 'TypeScript Patterns for Large Scale Apps',
    slug: 'typescript-patterns-scale',
    excerpt: 'Learn the TypeScript patterns that help you build maintainable, scalable applications. From branded types to the type-safe builder pattern.',
    content: `
# TypeScript Patterns for Large Scale Apps

Building large TypeScript apps requires more than just adding types. You need patterns that scale.

## Branded Types

Create nominal types for better type safety:

\`\`\`typescript
type UserId = string & { __brand: 'UserId' };
type OrderId = string & { __brand: 'OrderId' };

function getUser(id: UserId) { /* ... */ }
function getOrder(id: OrderId) { /* ... */ }

const userId = 'user-123' as UserId;
const orderId = 'order-456' as OrderId;

getUser(userId); // ✓
getUser(orderId); // ✗ Type error!
\`\`\`

## Exhaustive Checking

Use \`never\` to ensure all cases are handled:

\`\`\`typescript
type Status = 'pending' | 'active' | 'completed';

function getStatusMessage(status: Status): string {
  switch (status) {
    case 'pending': return 'Waiting...';
    case 'active': return 'In progress';
    case 'completed': return 'Done!';
    default:
      const _exhaustive: never = status;
      return _exhaustive;
  }
}
\`\`\`

## Builder Pattern

Type-safe builders for complex objects:

\`\`\`typescript
class QueryBuilder<T> {
  private conditions: string[] = [];
  
  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }
  
  build(): string {
    return \`SELECT * WHERE \${this.conditions.join(' AND ')}\`;
  }
}
\`\`\`

## Utility Types

Master built-in utilities:

- \`Pick<T, K>\` - Select properties
- \`Omit<T, K>\` - Remove properties
- \`Partial<T>\` - Make all optional
- \`Required<T>\` - Make all required

## Conclusion

These patterns help you write safer, more maintainable TypeScript code at scale.
    `,
    publishedAt: '2026-01-28',
    updatedAt: '2026-01-28',
    readTime: 7,
    tags: ['TypeScript', 'Patterns', 'Architecture'],
    author: {
      name: 'Your Name',
      avatar: '/avatar.jpg'
    },
    featured: true
  },
  {
    id: '5',
    title: 'My Development Setup in 2026',
    slug: 'dev-setup-2026',
    excerpt: 'A tour through my current development environment. From terminal to editor, here\'s what I use every day.',
    content: `
# My Development Setup in 2026

After years of tweaking, I've landed on a setup that just works. Here's what I use.

## Editor: VS Code

Still the best balance of speed and features.

### Key Extensions

1. **GitHub Copilot** - AI pair programming
2. **Error Lens** - Inline error messages
3. **Thunder Client** - API testing
4. **GitLens** - Git supercharged

### Settings

\`\`\`json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono",
  "editor.formatOnSave": true,
  "editor.minimap.enabled": false
}
\`\`\`

## Terminal: Ghostty

Fast, simple, and stays out of my way.

- GPU accelerated
- True color support
- Splits and tabs

## Shell: Fish

User-friendly and feature-rich out of the box.

- Autosuggestions
- Web-based config
- Amazing tab completion

## Tools

- **Git** - Version control
- **Docker** - Containerization  
- **fnm** - Node version management
- **ripgrep** - Fast search

## Hardware

- MacBook Pro M3 Max
- 32GB RAM
- 1TB SSD
- 27" 4K monitor

## Philosophy

> The best setup is the one you stop thinking about.

Don't over-engineer. Find what works and stick with it.

## Conclusion

Your tools should help you focus on the problem, not the tools themselves. Keep it simple.
    `,
    publishedAt: '2026-01-20',
    updatedAt: '2026-01-20',
    readTime: 4,
    tags: ['Tools', 'Productivity', 'Development'],
    author: {
      name: 'Your Name',
      avatar: '/avatar.jpg'
    },
    featured: false
  }
];
