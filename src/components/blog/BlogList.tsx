import React from 'react';
import type { BlogPost } from '../../types/blog';
import { BlogPostCard } from './BlogPostCard';
import './BlogList.css';

interface BlogListProps {
  posts: BlogPost[];
  onPostClick: (slug: string) => void;
}

export const BlogList: React.FC<BlogListProps> = ({ posts, onPostClick }) => {
  if (posts.length === 0) {
    return (
      <div className="blog-list-empty">
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div className="blog-list">
      {posts.map((post) => (
        <BlogPostCard 
          key={post.id} 
          post={post} 
          onClick={onPostClick}
        />
      ))}
    </div>
  );
};
