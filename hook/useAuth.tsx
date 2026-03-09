import { create } from "zustand";
type AuthStore = {
	step: "login" | "verify";
	setStep: (step: "login" | "verify") => void;
	email: string;
	setEmail: (email: string) => void;
};

export const useAuthStore = create<AuthStore>()(set => ({
	step: "login",
	setStep: step => set({ step }),
	email: "",
	setEmail: email => set({ email }),
}));
