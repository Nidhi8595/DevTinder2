import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer: MongoMemoryServer | null = null;

export async function connectToDatabase(mongoUri: string): Promise<void> {
	mongoose.set('strictQuery', true);
	try {
		if (!mongoUri) throw new Error('Missing MongoDB connection string');
		await mongoose.connect(mongoUri);
		return;
	} catch (err) {
		console.warn('Mongo connection failed, starting in-memory MongoDB for development...', err instanceof Error ? err.message : err);
		memoryServer = await MongoMemoryServer.create();
		const memUri = memoryServer.getUri('devtinder');
		await mongoose.connect(memUri);
	}
}

export default connectToDatabase;

