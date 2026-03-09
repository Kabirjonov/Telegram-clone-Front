import { IUser } from "@/types";
import { create } from "zustand";
type currentContact = {
	currentContact: IUser | null;
	setCurrentContact: (current: IUser | null) => void;
};

export const useCurrentContact = create<currentContact>()(set => ({
	currentContact: null,
	setCurrentContact: current => set({ currentContact: current }),
}));
