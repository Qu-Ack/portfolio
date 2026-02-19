import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DB_NAME = 'blog';
const POSTS_COLLECTION = 'posts';

// Verify JWT token
function verifyToken(req: VercelRequest): { userId: string; username: string } | null {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}

	const token = authHeader.substring(7);
	try {
		return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
	} catch {
		return null;
	}
}

// CORS headers
function setCorsHeaders(res: VercelResponse) {
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT,DELETE');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
	);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	setCorsHeaders(res);

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}

	if (!MONGODB_URI) {
		return res.status(500).json({ error: 'Database not configured' });
	}

	// Extract slug from URL - handle multiple formats
	let slug: string | undefined;

	// Try different ways Vercel might pass the parameter
	if (req.query.slug) {
		slug = typeof req.query.slug === 'string' ? req.query.slug : req.query.slug[0];
	} else if (req.query[0]) {
		// Sometimes Vercel passes it as an indexed parameter
		slug = typeof req.query[0] === 'string' ? req.query[0] : req.query[0][0];
	}

	// Debug logging
	console.log('Request URL:', req.url);
	console.log('Request query:', req.query);
	console.log('Extracted slug:', slug);
	if (!slug || typeof slug !== 'string') {
		return res.status(400).json({
			error: 'Slug is required',
			debug: { query: req.query, url: req.url }
		});
	}

	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		const db = client.db(DB_NAME);
		const posts = db.collection(POSTS_COLLECTION);

		// GET - Get single post
		if (req.method === 'GET') {
			const post = await posts.findOne({ slug });

			if (!post) {
				return res.status(404).json({ error: 'Post not found' });
			}

			return res.status(200).json(post);
		}

		// PUT - Update post (protected)
		if (req.method === 'PUT') {
			const user = verifyToken(req);
			if (!user) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			const existingPost = await posts.findOne({ slug });
			if (!existingPost) {
				return res.status(404).json({ error: 'Post not found' });
			}

			const { title, excerpt, content, tags, featured, status, coverImage, slug: newSlug } = req.body;

			// If changing slug, check it doesn't conflict
			if (newSlug && newSlug !== slug) {
				const existing = await posts.findOne({ slug: newSlug });
				if (existing) {
					return res.status(409).json({ error: 'Slug already exists' });
				}
			}

			// Calculate new read time if content changed
			let readTime = existingPost.readTime;
			if (content) {
				const wordCount = content.split(/\s+/).length;
				readTime = Math.ceil(wordCount / 200);
			}

			const updates: Record<string, unknown> = {
				updatedAt: new Date(),
				readTime,
			};

			if (title) updates.title = title;
			if (excerpt !== undefined) updates.excerpt = excerpt;
			if (content) updates.content = content;
			if (tags) updates.tags = tags;
			if (featured !== undefined) updates.featured = featured;
			if (status) updates.status = status;
			if (coverImage !== undefined) updates.coverImage = coverImage;
			if (newSlug) updates.slug = newSlug;

			const result = await posts.findOneAndUpdate(
				{ slug },
				{ $set: updates },
				{ returnDocument: 'after' }
			);

			return res.status(200).json(result);
		}

		// DELETE - Delete post (protected)
		if (req.method === 'DELETE') {
			const user = verifyToken(req);
			if (!user) {
				return res.status(401).json({ error: 'Unauthorized' });
			}

			const result = await posts.deleteOne({ slug });

			if (result.deletedCount === 0) {
				return res.status(404).json({ error: 'Post not found' });
			}

			return res.status(200).json({ message: 'Post deleted' });
		}

		return res.status(405).json({ error: 'Method not allowed' });
	} catch (error) {
		console.error('Post API error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	} finally {
		await client.close();
	}
}
