"use client";
import { Loader2 } from "lucide-react";
import ContactList from "./(conponents)/ContactList";
import { IApiResponse, IError, IMessage, IUser } from "@/types";
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
	// STATES START
	const [contacts, setContects] = useState<IUser[]>([]);
	const { currentContact } = useCurrentContact();
	const router = useRouter();
	const { setLoading, setCreating, isLoading, setLoadMessage } = useLoading();
	const { data: session } = useSession();
	const { setOnlineUsers } = useAuthStore();
	const socket = useRef<ReturnType<typeof io> | null>(null);
	const [messages, setMessage] = useState<IMessage[]>([]);
	// SCHEMA VALIDATE START

	const contactForm = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: "" },
	});
	const messageForm = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: { text: "", image: "" },
	});
	// USEEFFECT START
	useEffect(() => {
		router.replace("/");
		socket.current = io("ws://localhost:4000");
		return () => {
			socket.current?.disconnect();
			socket.current = null;
		};
	}, []);
	useEffect(() => {
		if (!session?.currentUser?._id || !socket.current) return;

		const handleOnlineUsers = (data: { socketId: string; user: IUser }[]) => {
			console.log(data);
			setOnlineUsers(data.map(item => item.user));
		};

		getContects();
		socket.current.emit("join", session.currentUser);
		socket.current.on("getOnlineUsers", handleOnlineUsers);

		return () => {
			socket.current?.off("getOnlineUsers", handleOnlineUsers);
		};
	}, [session?.currentUser]);
	useEffect(() => {
		if (!session?.currentUser || !socket.current) return;

		const handleCreateUser = (user: IUser) => {
			console.log("this is connect user:", user);

			setContects(prev => {
				const isExist = prev.some(item => item._id === user._id);
				return isExist ? prev : [...prev, user];
			});
		};

		socket.current.on("getCreateUser", handleCreateUser);

		return () => {
			socket.current?.off("getCreateUser", handleCreateUser);
		};
	}, [session?.currentUser]);
	useEffect(() => {
		if (currentContact?._id) {
			getMessage();
		}
	}, [currentContact]);
	// FUNCTIONS START
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
			console.log("oncreatecontact", data.body);
			socket.current?.emit("createContact", {
				currentUser: session?.currentUser,
				receiver: data.body,
			});
			contactForm.reset();

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
	const onSendMessage = async (values: z.infer<typeof messageSchema>) => {
		setCreating(true);
		const token = await generateToken(session?.currentUser._id);
		try {
			const { data } = await api.post<IApiResponse<IMessage>>(
				"/api/message/create-message",
				{ ...values, receiver: currentContact?._id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setMessage(prev => [...prev, data.body]);
			socket.current?.emit("sendMessage");
			messageForm.reset();
		} catch (error) {
		} finally {
			setCreating(false);
		}
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
	const getMessage = async () => {
		setLoadMessage(true);
		const token = await generateToken(session?.currentUser._id);
		try {
			const { data } = await api.get<IApiResponse<IMessage[]>>(
				`/api/message/message/${currentContact?._id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			setMessage(data.body);
		} catch (error) {
			console.log(error);
		} finally {
			setLoadMessage(false);
		}
	};

	// UI
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
						<Chat
							onSendMessage={onSendMessage}
							messageForm={messageForm}
							messages={messages}
						/>
					</div>
				)}
			</div>
		</>
	);
}
