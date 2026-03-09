"use client";

import { useAuthStore } from "@/hook/useAuth";
import VerifyAuth from "./verify";
import SignInPage from "./sign-in";

export default function StateAuth() {
	const { step } = useAuthStore();
	return (
		<>
			{step == "login" && <SignInPage />}
			{step == "verify" && <VerifyAuth />}
		</>
	);
}
