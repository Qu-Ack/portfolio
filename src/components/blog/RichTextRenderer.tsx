import React, { useState } from 'react';
import './RichTextRenderer.css';

interface RichTextRendererProps {
	content: string;
}

interface ImageData {
	alt: string;
	src: string;
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
	const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

	const handleImageError = (src: string) => {
		setBrokenImages(prev => new Set(prev).add(src));
	};

	const parseImage = (text: string): ImageData | null => {
		const match = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);
		if (match) {
			return { alt: match[1], src: match[2] };
		}
		return null;
	};

	const renderContent = (text: string): React.ReactNode => {
		const lines = text.trim().split('\n');
		const elements: React.ReactNode[] = [];
		let inCodeBlock = false;
		let codeContent: string[] = [];
		let codeLanguage = '';
		let listItems: string[] = [];
		let inList = false;

		const flushList = () => {
			if (listItems.length > 0) {
				elements.push(
					<ul key={`list-${elements.length}`} className="blog-list">
						{listItems.map((item, idx) => (
							<li key={idx}>{renderInlineFormatting(item)}</li>
						))}
					</ul>
				);
				listItems = [];
				inList = false;
			}
		};

		lines.forEach((line, index) => {
			if (inCodeBlock) {
				if (line.trim().startsWith('```')) {
					elements.push(
						<pre key={`code-${elements.length}`} className="blog-code-block">
							<code className={`language-${codeLanguage}`}>
								{codeContent.join('\n')}
							</code>
						</pre>
					);
					codeContent = [];
					inCodeBlock = false;
					codeLanguage = '';
				} else {
					codeContent.push(line);
				}
				return;
			}

			const trimmedLine = line.trim();

			if (trimmedLine.startsWith('```')) {
				flushList();
				inCodeBlock = true;
				codeLanguage = trimmedLine.slice(3);
				return;
			}

			// Check for standalone image
			const imageData = parseImage(trimmedLine);
			if (imageData && trimmedLine.startsWith('![')) {
				flushList();
				if (brokenImages.has(imageData.src)) {
					elements.push(
						<div key={`img-error-${index}`} className="blog-image-error">
							⚠️ Failed to load image: {imageData.alt || imageData.src}
						</div>
					);
				} else {
					elements.push(
						<img
							key={`img-${index}`}
							src={imageData.src}
							alt={imageData.alt}
							className="blog-image"
							onError={() => handleImageError(imageData.src)}
						/>
					);
				}
				return;
			}

			if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
				inList = true;
				listItems.push(trimmedLine.slice(2));
				return;
			}

			if (inList && trimmedLine.match(/^\d+\.\s/)) {
				listItems.push(trimmedLine.replace(/^\d+\.\s/, ''));
				return;
			}

			flushList();

			if (trimmedLine.startsWith('# ')) {
				elements.push(
					<h1 key={index} className="blog-heading blog-heading-1">
						{renderInlineFormatting(trimmedLine.slice(2))}
					</h1>
				);
			} else if (trimmedLine.startsWith('## ')) {
				elements.push(
					<h2 key={index} className="blog-heading blog-heading-2">
						{renderInlineFormatting(trimmedLine.slice(3))}
					</h2>
				);
			} else if (trimmedLine.startsWith('### ')) {
				elements.push(
					<h3 key={index} className="blog-heading blog-heading-3">
						{renderInlineFormatting(trimmedLine.slice(4))}
					</h3>
				);
			} else if (trimmedLine.startsWith('> ')) {
				elements.push(
					<blockquote key={index} className="blog-blockquote">
						<p>{renderInlineFormatting(trimmedLine.slice(2))}</p>
					</blockquote>
				);
			} else if (trimmedLine === '---') {
				elements.push(<hr key={index} className="blog-divider" />);
			} else if (trimmedLine === '') {
				return;
			} else {
				elements.push(
					<p key={index} className="blog-paragraph">
						{renderInlineFormatting(trimmedLine)}
					</p>
				);
			}
		});

		flushList();

		return elements;
	};

	const renderInlineFormatting = (text: string): React.ReactNode => {
		const parts: React.ReactNode[] = [];
		let remaining = text;
		let keyIndex = 0;

		while (remaining.length > 0) {
			let earliestMatch = -1;
			let matchType = '';
			let matchEnd = -1;
			let matchData: ImageData | null = null;

			const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
			if (boldMatch && boldMatch.index !== undefined) {
				if (earliestMatch === -1 || boldMatch.index < earliestMatch) {
					earliestMatch = boldMatch.index;
					matchType = 'bold';
					matchEnd = boldMatch.index + boldMatch[0].length;
				}
			}

			const codeMatch = remaining.match(/`(.+?)`/);
			if (codeMatch && codeMatch.index !== undefined) {
				if (earliestMatch === -1 || codeMatch.index < earliestMatch) {
					earliestMatch = codeMatch.index;
					matchType = 'code';
					matchEnd = codeMatch.index + codeMatch[0].length;
				}
			}

			const imageMatch = remaining.match(/!\[([^\]]*)\]\(([^)]+)\)/);
			if (imageMatch && imageMatch.index !== undefined) {
				if (earliestMatch === -1 || imageMatch.index < earliestMatch) {
					earliestMatch = imageMatch.index;
					matchType = 'image';
					matchEnd = imageMatch.index + imageMatch[0].length;
					matchData = { alt: imageMatch[1], src: imageMatch[2] };
				}
			}

			if (earliestMatch === -1) {
				parts.push(remaining);
				break;
			}

			if (earliestMatch > 0) {
				parts.push(remaining.substring(0, earliestMatch));
			}

			if (matchType === 'bold') {
				const content = remaining.substring(earliestMatch + 2, matchEnd - 2);
				parts.push(<strong key={keyIndex++}>{content}</strong>);
			} else if (matchType === 'code') {
				const content = remaining.substring(earliestMatch + 1, matchEnd - 1);
				parts.push(<code key={keyIndex++} className="blog-inline-code">{content}</code>);
			} else if (matchType === 'image' && matchData) {
				if (brokenImages.has(matchData.src)) {
					parts.push(
						<span key={keyIndex++} className="blog-image-error" style={{ display: 'inline' }}>
							[{matchData.alt || 'image'}]
						</span>
					);
				} else {
					parts.push(
						<img
							key={keyIndex++}
							src={matchData.src}
							alt={matchData.alt}
							className="blog-image"
							style={{ display: 'inline-block', margin: '0.5rem 0', maxHeight: '300px' }}
							onError={() => handleImageError(matchData!.src)}
						/>
					);
				}
			}

			remaining = remaining.substring(matchEnd);
		}

		return parts.length > 0 ? parts : text;
	};

	return <div className="rich-text-renderer">{renderContent(content)}</div>;
};
