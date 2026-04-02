import mongoose, { ConnectOptions } from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
	mongoose.set("strictQuery", true);
	if (!process.env.NEXT_MONGO_URL) {
		throw new Error("Database is not found");
	}
	if (isConnected) {
		return;
	}
	try {
		await mongoose.connect(process.env.NEXT_MONGO_URL, { autoCreate: true });
		isConnected = true;
	} catch (error) {
		console.log("Error connecting to databse");
	}
};
