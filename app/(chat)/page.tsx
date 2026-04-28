"use client";
import { Loader2 } from "lucide-react";
import ContactList from "./(conponents)/ContactList";
import { IApiResponse, IError, IUser } from "@/types";
import { useEffect, useRef, useState } from "react";
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
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useAuthStore } from "@/hook/useAuth";
export default function HomePage() {
	const [contacts, setContects] = useState<IUser[]>([]);
	const { currentContact } = useCurrentContact();
	const router = useRouter();
	const { setLoading, setCreating, isLoading } = useLoading();
	const { data: session } = useSession();
	const { onlineUsers, setOnlineUsers } = useAuthStore();
	const socket = useRef<ReturnType<typeof io> | null>(null);
	useEffect(() => {
		router.replace("/");
		socket.current = io("ws://localhost:4000");
	}, []);
	useEffect(() => {
		if (session?.currentUser._id) {
			getContects();
			socket.current?.emit("join", session?.currentUser);
			socket.current?.on(
				"getOnlineUsers",
				(data: { socketId: string; user: IUser }[]) => {
					console.log(data);
					setOnlineUsers(data.map(item => item.user));
				},
			);
		}
	}, [session?.currentUser]);
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
			console.log("create contact", data);
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
			setContects([...data.body]);
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
