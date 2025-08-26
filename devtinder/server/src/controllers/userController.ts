import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth';
import { UserModel } from '../models/User';
import mongoose from 'mongoose';

export async function getProfile(req: AuthenticatedRequest, res: Response) {
	try {
		const paramId = req.params.id;
		const userId = paramId === 'me' ? req.userId : paramId;
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid user id' });
		const user = await UserModel.findById(userId).select('-password').populate('connections', 'name profilePic skills');
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.json(user);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch profile' });
	}
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
	try {
		const { id } = req.params;
		if (!req.userId || req.userId !== id) return res.status(403).json({ message: 'Forbidden' });
		const updatable = ['name', 'bio', 'skills', 'interests', 'profilePic'] as const;
		const update: any = {};
		for (const key of updatable) {
			if (key in req.body) update[key] = (req.body as any)[key];
		}
		const user = await UserModel.findByIdAndUpdate(id, update, { new: true }).select('-password');
		return res.json(user);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update profile' });
	}
}

export async function listDevelopers(req: AuthenticatedRequest, res: Response) {
	try {
		const me = req.userId;
		const meDoc = me ? await UserModel.findById(me) : null;
		const exclude = [meDoc?._id, ...(meDoc?.connections || [])].filter(Boolean);
		const users = await UserModel.find({ _id: { $nin: exclude } }).select('-password').limit(50);
		return res.json(users);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to list developers' });
	}
}

export async function sendFriendRequest(req: AuthenticatedRequest, res: Response) {
	try {
		const targetId = req.params.id as string;
		const requesterId = req.userId as string;
		if (!requesterId || !mongoose.Types.ObjectId.isValid(targetId)) return res.status(400).json({ message: 'Invalid id' });
		if (requesterId === targetId) return res.status(400).json({ message: 'Cannot send request to self' });
		const target = await UserModel.findById(targetId);
		const requester = await UserModel.findById(requesterId);
		if (!target || !requester) return res.status(404).json({ message: 'User not found' });
		if (requester.connections.some(id => (id as any).equals(target._id))) return res.status(400).json({ message: 'Already connected' });
		if (target.friendRequests.some(id => (id as any).equals(requester._id))) return res.status(400).json({ message: 'Request already sent' });
		(target.friendRequests as any).push(requester._id);
		await target.save();
		return res.json({ message: 'Friend request sent' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to send request' });
	}
}

export async function acceptFriendRequest(req: AuthenticatedRequest, res: Response) {
	try {
		const requesterId = req.params.id as string;
		const currentUserId = req.userId as string;
		if (!currentUserId || !mongoose.Types.ObjectId.isValid(requesterId)) return res.status(400).json({ message: 'Invalid id' });
		const me = await UserModel.findById(currentUserId);
		const requester = await UserModel.findById(requesterId);
		if (!me || !requester) return res.status(404).json({ message: 'User not found' });
		if (!me.friendRequests.some(id => (id as any).equals(requester._id))) return res.status(400).json({ message: 'No request found' });
		me.friendRequests = me.friendRequests.filter(id => !(id as any).equals(requester._id));
		if (!me.connections.some(id => (id as any).equals(requester._id))) (me.connections as any).push(requester._id);
		if (!requester.connections.some(id => (id as any).equals(me._id))) (requester.connections as any).push(me._id);
		await me.save();
		await requester.save();
		return res.json({ message: 'Friend request accepted' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to accept request' });
	}
}

