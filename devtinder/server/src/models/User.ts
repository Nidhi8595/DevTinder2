import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	bio?: string;
	skills: string[];
	interests: string[];
	profilePic?: string;
	connections: Types.ObjectId[];
	friendRequests: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		bio: { type: String },
		skills: { type: [String], default: [] },
		interests: { type: [String], default: [] },
		profilePic: { type: String },
		connections: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
		friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
	},
	{ timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);

