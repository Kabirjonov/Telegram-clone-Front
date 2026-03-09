"use client";

import { IUser } from "@/types";
import Settings from "./Settings";
import { Input } from "@/components/ui/input";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentContact } from "@/hook/useCurrentContact";
interface Props {
	contactList: IUser[];
}

export default function ContactList({ contactList }: Props) {
	const { currentContact, setCurrentContact } = useCurrentContact();
	const renderContact = (contact: IUser) => {
		const router = useRouter();

		const onChat = () => {
			if (currentContact?._id === contact._id) return;
			setCurrentContact(contact);
			router.push(`/?chat=${contact._id}`);
		};
		return (
			<div
				className={cn(
					"flex justify-between items-center cursor-pointer hover:bg-secondary/50 p-2",
					currentContact?._id === contact._id && "bg-secondary",
				)}
				onClick={onChat}
			>
				<div className='flex items-center gap-2'>
					<div className='relative'>
						<Avatar>
							<AvatarImage
								src={contact.avatar}
								className='object-cover'
								alt='@shadcn'
							/>
							<AvatarFallback className='uppercase'>
								{contact.email[0]}
							</AvatarFallback>
							<AvatarBadge className='bg-green-600 dark:bg-green-800' />
						</Avatar>
					</div>
					<div>
						<h2 className='capitalize line-clamp-1 text-sm'>
							{contact.email.split("@")[0]}
						</h2>
						<p className='text-muted-foreground text-xs line-clamp-1'>
							No message yet
						</p>
					</div>
				</div>
				<div className='self-end'>
					<p className='text-xs text-muted-foreground'>20:00 am</p>{" "}
				</div>
			</div>
		);
	};
	return (
		<>
			<div className='flex items-center bg-background pl-2 sticky top-0'>
				<Settings />

				<div className='m-2 w-full'>
					<Input className='bg-secondary' type='text' placeholder='Search' />
				</div>
			</div>
			{contactList.length == 0 && (
				<div className='h-full w-full flex justify-center items-center text-center text-muted-foreground'>
					<p>Contact list is empty</p>
				</div>
			)}
			{contactList.map(user => (
				<div key={user._id}>{renderContact(user)}</div>
			))}
		</>
	);
}
