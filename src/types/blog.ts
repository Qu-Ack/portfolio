export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  featured?: boolean;
  status?: 'draft' | 'published';
  coverImage?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
