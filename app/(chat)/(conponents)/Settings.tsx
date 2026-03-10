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
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import InformationForm from "@/components/forms/informationForm";
import EmailForm from "@/components/forms/emailForm";
import NotificationForm from "@/components/forms/notificationForm";
import DangerZonaForm from "@/components/forms/dangerZonaForm";

export default function Settings() {
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();
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
						<span className='text-white'> info@gmail.com</span>
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
								<div className='flex items-center gap-1'>
									<UserPlus size={16} />
									<span className='text-sm'>Create contact</span>
								</div>
							</div>
							<div className='flex justify-between items-center p-2 hover:bg-secondary cursor-pointer'>
								<div className='flex items-center gap-1'>
									<VolumeOff size={16} />
									<span className='text-sm'>Mute</span>
								</div>
								<Switch />
							</div>
							<div className='flex justify-between items-center p-2 hover:bg-secondary cursor-pointer'>
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
							<div className='flex justify-between items-center p-2 bg-destructive cursor-pointer'>
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
							<AvatarFallback className='text-6xl uppercase '>
								SB
							</AvatarFallback>
							<Button size={"icon"} className='absolute right-0 bottom-0'>
								<Upload size={16} />
							</Button>
						</Avatar>
					</div>
					<Accordion type='single' collapsible className='mt-4'>
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
								<DangerZonaForm />/
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</SheetContent>
			</Sheet>
		</>
	);
}
