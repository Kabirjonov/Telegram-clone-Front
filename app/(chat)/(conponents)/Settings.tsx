"use client";
import { Button } from "@/components/ui/button";
import {
	LogIn,
	Menu,
	Moon,
	Settings2,
	Sun,
	Upload,
	UserPlus,
	Volume2,
	VolumeOff,
} from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InformationForm from "@/components/forms/informationForm";
import EmailForm from "@/components/forms/emailForm";
import NotificationForm from "@/components/forms/notificationForm";
import DangerZonaForm from "@/components/forms/dangerZonaForm";
import { useSession, signOut } from "next-auth/react";
import { IApiResponse } from "@/types";
import { generateToken } from "@/lib/tokenGenerate";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/https/axios";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";

export default function Settings() {
	const { data } = useSession();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();
	const user = data?.currentUser;
	const { data: session, update } = useSession();
	const { mutate, isPending } = useMutation({
		mutationFn: async (payload: { muted?: boolean; avatar?: string }) => {
			const token = await generateToken(session?.currentUser._id);
			const { data } = await api.put<IApiResponse<any>>(
				"/api/user/profile",
				payload,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			return data;
		},
		onSuccess: data => {
			toast.success(data.message);
			update();
		},
	});
	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button size={"icon"} variant={"secondary"}>
						<Menu />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='p-0 w-90'>
					<h2 className='pt-2 pl-2 text-muted-foreground'>
						Setting:
						<span className=' text-foreground text-sm'> {user?.email}</span>
						<Separator className='my-2' />
						<div className='flex flex-col'>
							<div
								className='flex justify-between items-center p-2 hover:bg-secondary cursor-pointer'
								onClick={() => setIsProfileOpen(true)}
							>
								<div className='flex items-center gap-1'>
									<Settings2 size={16} />
									<span className='text-sm'>Profile</span>
								</div>
							</div>
							<div className='flex justify-between items-center p-2 hover:bg-secondary cursor-pointer'>
								<div
									className='flex items-center gap-1'
									onClick={() => window.location.reload()}
								>
									<UserPlus size={16} />
									<span className='text-sm'>Create contact</span>
								</div>
							</div>
							<div className='flex justify-between items-center p-2 hover:bg-secondary cursor-pointer'>
								<div className='flex items-center gap-1'>
									{session?.currentUser.muted ? (
										<Volume2 size={16} />
									) : (
										<VolumeOff size={16} />
									)}
									<span className='text-sm'>
										{session?.currentUser.muted ? "Muted" : "Unmuted"}
									</span>
								</div>
								<Switch
									checked={session?.currentUser.muted}
									disabled={isPending}
									onCheckedChange={() =>
										mutate({ muted: !session?.currentUser.muted })
									}
								/>
							</div>
							<div className='flex justify-between items-center p-2  hover:bg-secondary cursor-pointer'>
								<div className='flex items-center gap-1'>
									{resolvedTheme == "dark" ? (
										<Sun size={16} />
									) : (
										<Moon size={16} />
									)}
									<span className='text-sm'>
										{resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
									</span>
								</div>
								<Switch
									checked={resolvedTheme === "dark" ? true : false}
									onCheckedChange={() =>
										setTheme(resolvedTheme === "dark" ? "light" : "dark")
									}
								/>
							</div>
							<div
								className='flex justify-between items-center p-2 bg-destructive cursor-pointer '
								onClick={() => signOut()}
							>
								<div className='flex items-center gap-1'>
									<LogIn size={16} />
									<span className='text-sm'>Logout</span>
								</div>
							</div>
						</div>
					</h2>
				</PopoverContent>
			</Popover>
			<Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
				<SheetContent side='left'>
					<SheetHeader>
						<SheetTitle>My Profile</SheetTitle>
						<SheetDescription>This action cannot be undone.</SheetDescription>
					</SheetHeader>
					<Separator />

					<div className='mx-auto w-1/2 h-36 relative'>
						<Avatar className='w-full h-36'>
							<AvatarImage
								src={session?.currentUser.avatar}
								alt={session?.currentUser.email}
								className='object-cover'
							/>
							<AvatarFallback className='text-6xl uppercase '>
								{session?.currentUser.email[0]}
							</AvatarFallback>
						</Avatar>
						<UploadButton
							endpoint='imageUploader'
							onClientUploadComplete={res => {
								console.log(res);
								mutate({ avatar: res[0].ufsUrl });
							}}
							config={{ appendOnPaste: true, mode: "auto" }}
							className='absolute right-0 bottom-0'
							appearance={{
								allowedContent: { display: "none" },
								button: {
									width: 40,
									height: 40,
									borderRadius: "100%",
									borderColor: "transparent",
								},
							}}
							content={{ button: <Upload size={16} /> }}
						/>
					</div>
					<Accordion type='single' collapsible className='mt-4 gap-2'>
						<AccordionItem value='item-1'>
							<AccordionTrigger className='bg-secondary px-2'>
								Basic Information
							</AccordionTrigger>
							<AccordionContent className='px-2 mt-2'>
								<InformationForm />
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value='item-2'>
							<AccordionTrigger className='bg-secondary px-2'>
								Email
							</AccordionTrigger>
							<AccordionContent className='px-2 mt-2'>
								<EmailForm />
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value='item-3'>
							<AccordionTrigger className='bg-secondary px-2'>
								Notification
							</AccordionTrigger>
							<AccordionContent className='px-2 mt-2'>
								<NotificationForm />
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value='item-4'>
							<AccordionTrigger className='bg-secondary px-2'>
								Danger Zona
							</AccordionTrigger>
							<AccordionContent className='px-2 mt-2'>
								<DangerZonaForm />
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</SheetContent>
			</Sheet>
		</>
	);
}
