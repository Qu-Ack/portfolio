import React from 'react';
import type { BlogPost } from '../../types/blog';
import './BlogPostCard.css';

interface BlogPostCardProps {
  post: BlogPost;
  onClick?: (slug: string) => void;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(post.slug);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article 
      className="blog-post-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
      <div className="post-card-content">
        <h3 className="post-card-title">{post.title}</h3>
        
        <div className="post-card-meta">
          <time className="post-card-date">{formatDate(post.publishedAt)}</time>
          <span className="post-card-separator">•</span>
          <span className="post-card-read-time">{post.readTime} min read</span>
        </div>
        
        <p className="post-card-excerpt">{post.excerpt}</p>
        
        {post.tags.length > 0 && (
          <div className="post-card-tags">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="post-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
