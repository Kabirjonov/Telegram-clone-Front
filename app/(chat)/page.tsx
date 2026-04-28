"use client";
import { Loader2 } from "lucide-react";
import ContactList from "./(conponents)/ContactList";
import { IApiResponse, IError, IUser } from "@/types";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import AddContact from "./(conponents)/AddContact";
import { useCurrentContact } from "@/hook/useCurrentContact";
import { useForm } from "react-hook-form";
import z from "zod";
import { messageSchema, emailSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import TopChat from "./(conponents)/TopChat";
import Chat from "./(conponents)/Chat";
import { useLoading } from "@/hook/useLoading";
import { api } from "@/https/axios";
import { generateToken } from "@/lib/tokenGenerate";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const mockList: IUser[] = [
	{
		// @ts-ignore
		_id: 2,
		email: "kabirjonov@gmail.com",
		avatar: "https://github.com/shadcn.png",
		firstName: "John",
		lastName: "Doe",
		bio: "Harry Potter is a global fantasy phenomenon featuring seven novels by J.K. Rowling (1997–2007) and eight blockbuster films (2001–2011) following a young wizard's fight against Lord Voldemort.",
	},
];
export default function HomePage() {
	const [contacts, setContects] = useState<IUser[]>([]);
	const { currentContact } = useCurrentContact();
	// const router = useRouter();
	const { setLoading, setCreating, isLoading } = useLoading();
	const { data: session } = useSession();
	// useEffect(() => {
	// 	router.push("/");
	// }, []);

	const contactForm = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: "" },
	});
	const messageForm = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: { text: "", image: "" },
	});
	const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
		setCreating(true);
		const token = await generateToken(session?.currentUser._id);
		try {
			const { data } = await api.post<IApiResponse<any>>(
				"/api/user/create-contact",
				values,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setContects(prev => [...prev, data.body]);
			toast.success(data.message);
		} catch (error: any) {
			if ((error as IError)?.response?.data?.message) {
				console.log(error.response.data.message);
				return toast.error((error as IError)?.response?.data?.message);
			}
			return toast.error("Something went wrong");
		} finally {
			setCreating(false);
		}
	};
	const onSendMessage = (values: z.infer<typeof messageSchema>) => {
		console.log(values);
	};
	const getContects = async () => {
		setLoading(true);
		const token = await generateToken(session?.currentUser._id);
		try {
			const { data } = await api.get<IApiResponse<any>>("/api/user/contacts", {
				headers: { Authorization: `Bearer ${token}` },
			});
			contactForm.reset();
			setContects(prev => [...prev, ...data.body]);
			setLoading(false);
		} catch (error: any) {
			if ((error as IError)?.response?.data?.message) {
				console.log(error.response.data.message);
				return toast.error((error as IError)?.response?.data?.message);
			}
			return toast.error("Something went wrong");
		} finally {
			setLoading(false);
			setCreating(false);
		}
	};
	useEffect(() => {
		if (session?.currentUser._id) getContects();
	}, [session?.currentUser]);
	return (
		<>
			<div className='w-[20%] h-screen border-r fixed inset-0 z-50'>
				{isLoading && (
					<div className='w-full h-[95vh] flex justify-center items-center'>
						<Loader2 size={50} className='animate-spin' />
					</div>
				)}
				{!isLoading && <ContactList contactList={contacts} />}
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
