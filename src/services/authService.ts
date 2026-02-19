import type { LoginCredentials, LoginResponse } from '../types/auth';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
class AuthService {

	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(credentials),
		});

		if (!response.ok) {
			throw new Error('Invalid credentials');
		}

		return response.json();
	}

	async verifyToken(token: string): Promise<boolean> {
		const response = await fetch(`${API_URL}/auth/verify`, {
			headers: { 'Authorization': `Bearer ${token}` },
		});
		return response.ok;
	}

	logout(): void {
		// TODO: Call logout endpoint if needed
		console.log('Logged out');
	}

	getAuthHeader(): Record<string, string> {
		const token = localStorage.getItem('auth_token');
		return token ? { Authorization: `Bearer ${token}` } : {};
	}
}

export const authService = new AuthService();
