import type { BlogPost } from '../types/blog';
import { testPosts } from './posts';

class BlogCMS {
	private posts: BlogPost[] = [...testPosts];

	getAllPosts(): BlogPost[] {
		return this.posts.sort((a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
		);
	}

	getPostBySlug(slug: string): BlogPost | undefined {
		return this.posts.find(post => post.slug === slug);
	}

	getPostById(id: string): BlogPost | undefined {
		return this.posts.find(post => post.id === id);
	}

	getFeaturedPosts(): BlogPost[] {
		return this.posts.filter(post => post.featured);
	}

	getPostsByTag(tag: string): BlogPost[] {
		return this.posts.filter(post =>
			post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
		);
	}

	searchPosts(query: string): BlogPost[] {
		const lowercaseQuery = query.toLowerCase();
		return this.posts.filter(post =>
			post.title.toLowerCase().includes(lowercaseQuery) ||
			post.excerpt.toLowerCase().includes(lowercaseQuery) ||
			post.content.toLowerCase().includes(lowercaseQuery)
		);
	}

	createPost(post: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt'>): BlogPost {
		const newPost: BlogPost = {
			...post,
			id: Date.now().toString(),
			publishedAt: new Date().toISOString().split('T')[0],
			updatedAt: new Date().toISOString().split('T')[0]
		};
		this.posts.push(newPost);
		return newPost;
	}

	updatePost(id: string, updates: Partial<BlogPost>): BlogPost | undefined {
		const index = this.posts.findIndex(post => post.id === id);
		if (index === -1) return undefined;

		this.posts[index] = {
			...this.posts[index],
			...updates,
			updatedAt: new Date().toISOString().split('T')[0]
		};
		return this.posts[index];
	}

	deletePost(id: string): boolean {
		const index = this.posts.findIndex(post => post.id === id);
		if (index === -1) return false;
		this.posts.splice(index, 1);
		return true;
	}
}

export const blogCMS = new BlogCMS();
