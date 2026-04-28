export interface IUser {
	_id: string;
	email: string;
	avatar?: string;
	firstName?: string;
	lastName?: string;
	bio?: string;
	muted: boolean;
	notificationSound: string;
	sendingSound: string;
	isVerified: boolean;
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
