export interface IUser {
	isVerified: boolean;
	email: string;
	_id: string;
	avatar?: string;
	firstName?: string;
	lastName?: string;
	bio?: string;
	muted: boolean;
	notificationSound: string;
	sendingSound: string;
	contacts: IUser[];
}
export interface IApiResponse<T = null> {
	message: string;
	body: T;
	status: number;
}
export interface IError {
	response: { data: { message: string } };
}
