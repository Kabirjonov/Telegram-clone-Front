import { FaTelegram } from "react-icons/fa";
import StateAuth from "./(page)/state";
import SocialAuth from "./(page)/social";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/auth.config";
import { redirect } from "next/navigation";

export default async function AuthPage() {
	const session = await getServerSession(authConfig);
	if (session) {
		return redirect("/");
	}
	return (
		<div className='relative'>
			<div className='absolute right-10 top-5'>
				<ModeToggle />
			</div>
			<div className='container p-1 max-w-md mx-auto w-full h-screen flex justify-center items-center flex-col space-y-4'>
				<FaTelegram size={120} className='text-blue-500' />
				<div>
					<h1 className='text-4xl font-bold text-center'>Telegram</h1>
				</div>

				<StateAuth />
				<SocialAuth />
			</div>
		</div>
	);
}
