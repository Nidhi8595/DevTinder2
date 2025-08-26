import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
	userId?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	try {
		const bearer = req.headers.authorization;
		const token = bearer?.startsWith('Bearer ')
			? bearer.substring('Bearer '.length)
			: (req.cookies?.token as string | undefined);
		if (!token) return res.status(401).json({ message: 'Unauthorized' });
		const secret = process.env.JWT_SECRET as string;
		const payload = jwt.verify(token, secret) as { userId: string };
		req.userId = payload.userId;
		return next();
	} catch (err) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
}

export function signToken(userId: string): string {
	const secret = process.env.JWT_SECRET as string;
	return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}

