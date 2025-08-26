import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User';
import { signToken } from '../middleware/auth';

export async function signup(req: Request, res: Response) {
	try {
		const { name, email, password } = req.body as { name: string; email: string; password: string };
		if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
		const exists = await UserModel.findOne({ email });
		if (exists) return res.status(409).json({ message: 'Email already registered' });
		const hashed = await bcrypt.hash(password, 10);
		const user = await UserModel.create({ name, email, password: hashed });
		const token = signToken(user.id);
		setAuthCookie(res, token);
		return res.status(201).json(sanitizeUser(user, token));
	} catch (err) {
		return res.status(500).json({ message: 'Signup failed' });
	}
}

export async function login(req: Request, res: Response) {
	try {
		const { email, password } = req.body as { email: string; password: string };
		if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
		const user = await UserModel.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		const token = signToken(user.id);
		setAuthCookie(res, token);
		return res.json(sanitizeUser(user, token));
	} catch (err) {
		return res.status(500).json({ message: 'Login failed' });
	}
}

function sanitizeUser(user: any, token: string) {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		bio: user.bio,
		skills: user.skills,
		interests: user.interests,
		profilePic: user.profilePic,
		connections: user.connections,
		friendRequests: user.friendRequests,
		token,
	};
}

function setAuthCookie(res: Response, token: string) {
	const isProd = process.env.NODE_ENV === 'production';
	res.cookie('token', token, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? 'none' : 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
}

