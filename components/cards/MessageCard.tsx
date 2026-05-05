import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { useSession } from "next-auth/react";
interface Props {
	message: IMessage;
}
export default function MessageCard({ message }: Props) {
	const { data: session } = useSession();
	const currentUserId = session?.currentUser?._id;
	const isCurrent = message.sender?._id === currentUserId;
	return (
		<div
			className={cn(
				"m-2.5 font-medium text-xs flex ",
				isCurrent ? "justify-end" : "justify-start",
			)}
		>
			<div
				className={cn(
					"relative inline p-2 pl-2.5 pr-12 max-w-full ",
					isCurrent ? "bg-secondary" : "bg-primary",
				)}
			>
				<p className='text-sm text-white'>{message.text}</p>
				<span className='text-xs right-1 bottom-0 absolute opacity-60'>
					{message.status === "sent" ? "c" : "cc"}
				</span>
			</div>
		</div>
	);
}
