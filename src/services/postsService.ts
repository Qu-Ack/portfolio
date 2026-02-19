import type { BlogPost } from '../types/blog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class PostsService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getAllPosts(status?: 'draft' | 'published'): Promise<BlogPost[]> {
    const url = new URL(`${API_URL}/posts`);
    if (status) {
      url.searchParams.set('status', status);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    
    // Transform MongoDB _id to id for frontend compatibility
    return posts.map((post: BlogPost & { _id: string }) => ({
      ...post,
      id: post._id,
    }));
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const response = await fetch(`${API_URL}/posts/${slug}`);
    
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    const post = await response.json();
    return {
      ...post,
      id: post._id,
    };
  }

  async createPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create post');
    }

    const newPost = await response.json();
    return {
      ...newPost,
      id: newPost._id,
    };
  }

  async updatePost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const response = await fetch(`${API_URL}/posts/${slug}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update post');
    }

    const updatedPost = await response.json();
    return {
      ...updatedPost,
      id: updatedPost._id,
    };
  }

  async deletePost(slug: string): Promise<void> {
    const response = await fetch(`${API_URL}/posts/${slug}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete post');
    }
  }
}

export const postsService = new PostsService();
