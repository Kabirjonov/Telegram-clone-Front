"use client";
import { Loader2 } from "lucide-react";
import ContactList from "./(conponents)/ContactList";
import { IApiResponse, IError, IGetSocketType, IMessage, IUser } from "@/types";
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
import { useSearchParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useAuthStore } from "@/hook/useAuth";
import useAudio from "@/hook/useAudio";
import { Button } from "@/components/ui/button";
import { MessageStatus } from "@/constants/const";
export default function HomePage() {
	const searchParams = useSearchParams();
	const activeChatId = searchParams.get("chat");
	// STATES START
	const [contacts, setContects] = useState<IUser[]>([]);
	const { currentContact, setCurrentContact } = useCurrentContact();
	const router = useRouter();
	const { setLoading, setCreating, isLoading, setLoadMessage } = useLoading();
	const { data: session } = useSession();
	const { setOnlineUsers } = useAuthStore();
	const socket = useRef<ReturnType<typeof io> | null>(null);
	const [messages, setMessage] = useState<IMessage[]>([]);
	const { playSound } = useAudio();
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
		const handleGetNewMessage = ({
			newMessage,
			receiver,
			sender,
		}: IGetSocketType) => {
			setMessage(prev => {
				const isExist = prev.some(item => item._id === newMessage._id);
				return isExist ? prev : [...prev, newMessage];
			});
			const isActiveChat = activeChatId === sender._id;
			setContects(prev =>
				prev.map(item =>
					item._id === sender?._id
						? { ...item, lastMessage: newMessage }
						: item,
				),
			);
			if (!isActiveChat) {
				toast.info(`New Message: ${sender.email.split("@")[0]}`, {
					description: newMessage.text,
					action: {
						label: "Open",
						onClick: () => onChat(sender),
					},
				});
			}
			if (receiver.muted) {
				playSound(receiver.notificationSound);
				console.log(receiver.notificationSound);
			}
		};
		const handleReadMessage = (messages: IMessage[]) => {
			setMessage(prev => {
				return prev.map(item => {
					const message = messages.find(msg => msg._id === item._id);
					return message ? { ...message, status: message.status } : item;
				});
			});
		};

		socket.current.on("getCreateUser", handleCreateUser);
		socket.current.on("getNewMessage", handleGetNewMessage);
		socket.current.on("getReadMessage", handleReadMessage);

		return () => {
			socket.current?.off("getCreateUser", handleCreateUser);
			socket.current?.off("getNewMessage", handleGetNewMessage);
			socket.current?.off("getReadMessage", handleReadMessage);
		};
	}, [session?.currentUser]);
	useEffect(() => {
		if (currentContact?._id) {
			getMessage();
		}
	}, [currentContact]);
	// FUNCTIONS START
	const onChat = (contact: IUser) => {
		if (currentContact?._id === contact._id) return;
		setCurrentContact(contact);
		router.push(`/?chat=${contact._id}`);
	};

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
			const { data } = await api.post<IApiResponse<IGetSocketType>>(
				"/api/message/create-message",
				{ ...values, receiver: currentContact?._id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setMessage(prev => [...prev, data.body.newMessage]);
			setContects(prev =>
				prev.map(item =>
					item._id === currentContact?._id
						? { ...item, lastMessage: data.body.newMessage }
						: item,
				),
			);
			socket.current?.emit("sendMessage", {
				newMessage: data.body.newMessage,
				receiver: data.body.receiver,
				sender: data.body.sender,
			});

			messageForm.reset();
		} catch (error) {
		} finally {
			setCreating(false);
		}
	};
	const onReadMessages = async () => {
		const receivedMessage = messages
			.filter(message => message.receiver._id === session?.currentUser._id)
			.filter(message => message.status !== MessageStatus.READ);
		if (receivedMessage.length === 0) return;
		const token = await generateToken(session?.currentUser._id);
		try {
			const { data } = await api.post<IApiResponse<IMessage[]>>(
				`/api/message/read`,
				{ messages: receivedMessage },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			socket.current?.emit("readMessage", {
				receiver: currentContact,
				messages: data.body,
			});
			setMessage(prev => {
				return prev.map(item => {
					const message = data.body.find(msg => msg._id === item._id);
					return message ? { ...message, status: message.status } : item;
				});
			});
			console.log("readble data:", data);
		} catch (error) {
			toast.error("Cannot read message");
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
						<Button onClick={() => playSound("5.mp3")}>Click</Button>
						<TopChat />
						<Chat
							onSendMessage={onSendMessage}
							messageForm={messageForm}
							messages={messages}
							onReadMessages={onReadMessages}
						/>
					</div>
				)}
			</div>
		</>
	);
}
