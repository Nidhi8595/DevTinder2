import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import connectToDatabase from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import chatRoutes from './routes/chat';
import { initSockets } from './sockets';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/', (_req, res) => res.json({ ok: true, name: 'DevTinder API' }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/chat', chatRoutes);

async function start() {
	try {
		await connectToDatabase(process.env.MONGO_URI as string);
		initSockets(server, CLIENT_ORIGIN);
		server.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
	} catch (err) {
		console.error('Failed to start server', err);
		process.exit(1);
	}
}

start();

