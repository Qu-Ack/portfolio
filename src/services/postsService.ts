import type { BlogPost } from '../types/blog';
import { getAllPosts, getPostBySlug } from '../utils/postsLoader';

class PostsService {
  async getAllPosts(status?: 'draft' | 'published'): Promise<BlogPost[]> {
    const posts = getAllPosts();
    return status ? posts.filter(p => p.status === status) : posts;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return getPostBySlug(slug);
  }
}

export const postsService = new PostsService();
