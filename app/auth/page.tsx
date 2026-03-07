import React from "react";
import { FaTelegram } from "react-icons/fa";
import StateAuth from "./(page)/state";
import SocialAuth from "./(page)/social";

export default function AuthPage() {
	return (
		<div className='container p-1 max-w-md mx-auto w-full h-screen flex justify-center items-center flex-col space-y-4'>
			<FaTelegram size={120} className='text-blue-500' />
			<div>
				<h1 className='text-4xl font-bold text-center'>Telegram</h1>
			</div>

			<StateAuth />
			<SocialAuth />
		</div>
	);
}
