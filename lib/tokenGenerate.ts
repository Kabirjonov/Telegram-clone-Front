"use server";
import jwt from "jsonwebtoken";

export const generateToken = async (id?: string) => {
	return await jwt.sign({ id }, process.env.NEXT_PUBLIC_JWT_SECRET as string, {
		expiresIn: "1m",
	});
};
