import { MessageStatus } from "@/constants/const";
import { useCurrentContact } from "@/hook/useCurrentContact";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";
interface Props {
	message: IMessage;
}
export default function MessageCard({ message }: Props) {
	const { currentContact } = useCurrentContact();
	return (
		<div
			className={cn(
				"m-2.5 font-medium text-xs flex ",
				message.receiver._id === currentContact?._id
					? "justify-end"
					: "justify-start",
			)}
		>
			<div
				className={cn(
					"relative inline p-2 pl-2.5 pr-12 max-w-full ",
					message.receiver._id === currentContact?._id
						? "bg-secondary"
						: "bg-primary",
				)}
			>
				<p className='text-sm text-white'>{message.text}</p>
				<div className='right-1 bottom-0 absolute opacity-60 text-[9px] flex-row gap-[3px]'>
					<p>{format(message.createdAt, "hh:mm")}</p>
					<div className='self-end flex justify-end'>
						{message.sender._id === currentContact?._id &&
							(message.status === MessageStatus.READ ? (
								<CheckCheck size={12} />
							) : (
								<Check size={12} />
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
