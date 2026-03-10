"use client";
import { Loader2 } from "lucide-react";
import ContactList from "./(conponents)/ContactList";
import { IUser } from "@/types";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AddContact from "./(conponents)/AddContact";
import { useCurrentContact } from "@/hook/useCurrentContact";
import { useForm } from "react-hook-form";
import z from "zod";
import { messageSchema, emailSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import TopChat from "./(conponents)/TopChat";
import Chat from "./(conponents)/Chat";

const mockList: IUser[] = [
	{
		_id: 2,
		email: "kabirjonov@gmail.com",
		avatar: "https://github.com/shadcn.png",
		firstName: "John",
		lastName: "Doe",
		bio: "Harry Potter is a global fantasy phenomenon featuring seven novels by J.K. Rowling (1997–2007) and eight blockbuster films (2001–2011) following a young wizard's fight against Lord Voldemort.",
	},
];
export default function HomePage() {
	const { currentContact } = useCurrentContact();
	const router = useRouter();

	useEffect(() => {
		router.push("/");
	}, []);

	const contactForm = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: "" },
	});
	const messageForm = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: { text: "", image: "" },
	});
	const onCreateContact = (values: z.infer<typeof emailSchema>) => {
		console.log(values);
	};
	const onSendMessage = (values: z.infer<typeof messageSchema>) => {
		console.log(values);
	};
	return (
		<>
			<div className='w-[20%] h-screen border-r fixed inset-0 z-50'>
				{/* <div className='w-full h-[95vh] flex justify-center items-center'>
				<Loader2 size={50} className='animate-spin' />
			</div> */}
				<ContactList contactList={mockList} />
			</div>
			<div className='w-[80%] ml-[20%] flex h-screen'>
				{!currentContact?._id && (
					<AddContact
						contactForm={contactForm}
						onCreateContact={onCreateContact}
					/>
				)}
				{currentContact?._id && (
					<div className='w-full relative'>
						<TopChat />
						<Chat onSendMessage={onSendMessage} messageForm={messageForm} />
					</div>
				)}
			</div>
		</>
	);
}
