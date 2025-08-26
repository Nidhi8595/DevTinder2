import type { Response } from 'express';
import mongoose from 'mongoose';
import type { AuthenticatedRequest } from '../middleware/auth';
import { MessageModel } from '../models/Message';
import { getIo } from '../sockets';

export async function getChatHistory(req: AuthenticatedRequest, res: Response) {
	try {
		const currentUserId = req.userId as string;
		const connectionId = req.params.connectionId as string;
		if (!currentUserId || !mongoose.Types.ObjectId.isValid(connectionId)) return res.status(400).json({ message: 'Invalid id' });
		const messages = await MessageModel.find({
			$or: [
				{ senderId: currentUserId, receiverId: connectionId },
				{ senderId: connectionId, receiverId: currentUserId },
			],
		})
			.sort({ timestamp: 1 })
			.limit(200);
		return res.json(messages);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch chat' });
	}
}

export async function sendMessage(req: AuthenticatedRequest, res: Response) {
	try {
		const currentUserId = req.userId as string;
		const { receiverId, text } = req.body as { receiverId: string; text: string };
		if (!currentUserId || !receiverId || !text) return res.status(400).json({ message: 'Missing fields' });
		const message = await MessageModel.create({ senderId: currentUserId, receiverId, text });
		const io = getIo();
		io.to(`user:${receiverId}`).emit('message', message);
		return res.status(201).json(message);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to send message' });
	}
}

