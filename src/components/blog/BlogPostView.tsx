import React from 'react';
import type { BlogPost } from '../../types/blog';
import { RichTextRenderer } from './RichTextRenderer';
import './BlogPostView.css';

interface BlogPostViewProps {
	post: BlogPost;
	onBack?: () => void;
}

export const BlogPostView: React.FC<BlogPostViewProps> = ({ post, onBack }) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	};

	return (
		<article className="blog-post-view">
			{onBack && (
				<a
					href="#posts"
					className="back-link"
					onClick={(e) => {
						e.preventDefault();
						onBack();
					}}
				>
					← All Posts
				</a>
			)}

			<header className="post-view-header">
				<h1 className="post-view-title">{post.title}</h1>

				<div className="post-view-meta">
					<time dateTime={post.publishedAt}>
						Published: {formatDate(post.publishedAt)}
					</time>
					<span className="post-view-separator">•</span>
					<span>{post.readTime} min read</span>
				</div>

				{post.tags.length > 0 && (
					<div className="post-view-tags">
						{post.tags.map((tag, index) => (
							<span key={index} className="post-view-tag">
								{tag}
							</span>
						))}
					</div>
				)}
			</header>

			<div className="post-view-content">
				<RichTextRenderer content={post.content} />
			</div>

			<footer className="post-view-footer">
				{post.updatedAt !== post.publishedAt && (
					<p className="post-view-updated">
						Updated: {formatDate(post.updatedAt)}
					</p>
				)}
			</footer>
		</article>
	);
};
