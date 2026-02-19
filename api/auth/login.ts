import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if credentials match
    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    let isValidPassword = false;
    
    if (ADMIN_PASSWORD_HASH) {
      // If hash is provided, compare with bcrypt
      isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } else {
      // For development, allow default credentials
      isValidPassword = password === 'admin';
    }

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: '1', username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: '1', username, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      user: {
        id: '1',
        username,
      },
      tokens: {
        accessToken: token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
