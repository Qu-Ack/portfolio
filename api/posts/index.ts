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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
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

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const posts = db.collection(POSTS_COLLECTION);

    // GET - List all posts (public)
    if (req.method === 'GET') {
      const { status = 'published', featured, tag } = req.query;
      
      const query: Record<string, unknown> = {};
      if (status) query.status = status;
      if (featured === 'true') query.featured = true;
      if (tag) query.tags = { $in: [tag] };

      const allPosts = await posts
        .find(query)
        .sort({ publishedAt: -1 })
        .toArray();

      return res.status(200).json(allPosts);
    }

    // POST - Create new post (protected)
    if (req.method === 'POST') {
      const user = verifyToken(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { title, slug, excerpt, content, tags, featured, status = 'draft', coverImage } = req.body;

      if (!title || !slug || !content) {
        return res.status(400).json({ error: 'Title, slug, and content are required' });
      }

      // Check if slug already exists
      const existing = await posts.findOne({ slug });
      if (existing) {
        return res.status(409).json({ error: 'Slug already exists' });
      }

      // Calculate read time (approx 200 words per minute)
      const wordCount = content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      const newPost = {
        title,
        slug,
        excerpt: excerpt || content.substring(0, 150) + '...',
        content,
        publishedAt: new Date(),
        updatedAt: new Date(),
        readTime,
        tags: tags || [],
        author: {
          name: user.username,
          avatar: '/avatar.jpg',
        },
        featured: featured || false,
        status,
        coverImage: coverImage || null,
      };

      const result = await posts.insertOne(newPost);
      
      return res.status(201).json({
        ...newPost,
        _id: result.insertedId,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Posts API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}
