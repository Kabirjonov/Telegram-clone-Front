import { useCurrentContact } from "@/hook/useCurrentContact";
import { cn } from "@/lib/utils";
import { IMessage } from "@/types";
interface Props {
	message: IMessage;
}
export default function MessageCard({ message }: Props) {
	const { currentContact } = useCurrentContact();

	if (!message?.receiver || !currentContact?._id) {
		console.log({
			receiverId: message,
			currentContactId: currentContact,
		});
		return null;
	}
	const isCurrent = message.receiver._id === currentContact?._id;
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
				<span className='text-xs right-1 bottom-0 absolute opacity-60'>c</span>
			</div>
		</div>
	);
}
