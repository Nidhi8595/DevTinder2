import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

let io: Server;
const onlineUsers = new Set<string>();

export function initSockets(server: HttpServer, corsOrigin: string) {
	io = new Server(server, {
		cors: { origin: corsOrigin, credentials: true },
	});

	io.on('connection', socket => {
		const userId = socket.handshake.auth?.userId as string | undefined;
		if (userId) {
			socket.join(`user:${userId}`);
			onlineUsers.add(userId);
			io.emit('presence', { userId, online: true });
		}

		socket.on('typing', (data: { to: string; typing: boolean }) => {
			io.to(`user:${data.to}`).emit('typing', { from: userId, typing: data.typing });
		});

		socket.on('disconnect', () => {
			if (userId) {
				onlineUsers.delete(userId);
				io.emit('presence', { userId, online: false });
			}
		});
	});

	return io;
}

export function getIo(): Server {
	if (!io) throw new Error('Socket.io not initialized');
	return io;
}

export function isOnline(userId: string): boolean {
	return onlineUsers.has(userId);
}

