import { IUser } from "@/types";

export const isUserOnline = (users: IUser[], userId: string) => {
	return users.some(u => u._id === userId);
};
