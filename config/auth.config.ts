import { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongoose";
import userModel from "@/models/user.model";

export const authConfig: AuthOptions = {
	providers: [
		Google({
			clientId: "",
			clientSecret: "",
		}),

		Credentials({
			name: "Credentials",
			credentials: { email: { label: "Email", type: "email" } },
			async authorize(credentials) {
				if (!credentials?.email) return null;
				await connectToDatabase();
				const user = await userModel
					.findOne({ email: credentials.email })
					.lean();
				if (!user) return null;

				return {
					id: String(user._id),
					email: user.email,
					image: user.avatar ?? null,
					name:
						[user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
						user.email,
				};
			},
		}),
	],
	callbacks: {
		async session({ session }) {
			await connectToDatabase();
			if (!session.user?.email) return session;

			const isExist = await userModel
				.findOne({ email: session.user.email })
				.lean();
			if (!isExist) {
				const user = await userModel.create({
					email: session.user.email,
					isVerified: true,
					avatar: session.user.image ?? undefined,
				});
				session.currentUser = user;
				session.currentUser = {
					...user.toObject(),
					_id: String(user._id),
				};
				return session;
			}
			session.currentUser = isExist;
			session.currentUser = {
				...isExist,
				_id: String(isExist._id),
			};
			return session;
		},
	},
	session: { strategy: "jwt" },
	jwt: { secret: process.env.NEXTAUTH_SECRET },
	secret: process.env.NEXTAUTH_SECRET,
	pages: { signIn: "/auth", signOut: "/auth" },
};
