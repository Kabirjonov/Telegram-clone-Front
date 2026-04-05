"use server";
import jwt from "jsonwebtoken";

export const generateToken = async (id?: string, email?: string) => {
	return await jwt.sign(
		{ id, email },
		process.env.NEXT_PUBLIC_JWT_SECRET as string,
		{
			expiresIn: "1m",
		},
	);
};
