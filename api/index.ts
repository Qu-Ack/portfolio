import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
	res.status(200).json({
		message: 'Blog API is running',
		version: '1.0.0',
		endpoints: {
			auth: {
				login: 'POST /api/auth/login',
				verify: 'GET /api/auth/verify',
			},
			posts: {
				list: 'GET /api/posts',
				get: 'GET /api/posts/:slug',
				create: 'POST /api/posts (protected)',
				update: 'PUT /api/posts/:id (protected)',
				delete: 'DELETE /api/posts/:id (protected)',
			},
		},
	});
}
