import { IUser } from "@/types";
import { Schema, model, models } from "mongoose";
const userSchema = new Schema<IUser>(
	{
		email: { type: String, required: true, unique: true },
		isVerified: { type: Boolean, default: false },
		firstName: { type: String },
		lastName: { type: String },
		bio: { type: String },
		avatar: { type: String },
		muted: { type: Boolean, default: false },
		notificationSound: { type: String, default: "2.mp3" },
		sendingSound: { type: String, default: "2.mp3" },
		contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true },
);

export default models.User || model("User", userSchema);
