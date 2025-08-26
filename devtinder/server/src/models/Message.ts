import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
	senderId: Types.ObjectId;
	receiverId: Types.ObjectId;
	text: string;
	timestamp: Date;
	seen: boolean;
}

const MessageSchema = new Schema<IMessage>(
	{
		senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		text: { type: String, required: true },
		timestamp: { type: Date, default: Date.now },
		seen: { type: Boolean, default: false },
	},
	{ timestamps: false }
);

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

