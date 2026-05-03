import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/hook/useAuth";
import { useCurrentContact } from "@/hook/useCurrentContact";
import { isUserOnline } from "@/lib/isUserOnline";
import {
	Ban,
	BrushCleaning,
	EllipsisVertical,
	Settings,
	Trash,
} from "lucide-react";
import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
export default function TopChat() {
	const { currentContact } = useCurrentContact();
	const { onlineUsers } = useAuthStore();
	return (
		<div className='w-full flex items-center justify-between sticky top-0 z-50 h-[8vh] p-2 border-b bg-background'>
			<div className='flex items-center'>
				<Avatar className='z-40'>
					<AvatarImage
						src={currentContact?.avatar}
						alt={currentContact?.email}
						className='object-cover'
					/>
					<AvatarFallback className='uppercase'>
						{currentContact?.email[0]}
					</AvatarFallback>
				</Avatar>
				<div className='ml-2'>
					<h2 className='font-medium text-sm'>
						{currentContact?.firstName && currentContact.lastName
							? currentContact?.firstName + " " + currentContact?.lastName
							: currentContact?.email}
					</h2>
					{/* IS typeing */}
					{/* <div className='text-xs flex items-center gap-1 text-muted-foreground'>
						<p className='text-secondary-foreground animate-pulse line-clamp-1'>
							Hello World
						</p>
						<div className='self-end mb-1'>
							<div className='flex justify-center items-center gap-1'>
								<div className='w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:-0.3s]'></div>
								<div className='w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:-0.10s]'></div>
								<div className='w-1 h-1 bg-secondary-foreground rounded-full animate-bounce [animation-delay:-0.15s]'></div>
							</div>
						</div>
					</div> */}
					<p className='text-xs flex items-center gap-1'>
						{/* Online */}
						{/* */}
						{/* Offline */}
						{isUserOnline(onlineUsers, currentContact?._id) ? (
							<>
								<span className='h-1.5 w-1.5 bg-green-500 rounded-full' />
								Online{" "}
							</>
						) : (
							<>
								<span className='h-1.5 w-1.5 bg-gray-500 rounded-full' />
								Offline
							</>
						)}
					</p>
				</div>
			</div>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant={"ghost"} size={"icon"}>
						<Settings />
					</Button>
				</SheetTrigger>
				<SheetContent className='px-1'>
					<SheetHeader className='flex items-'>
						<Dialog>
							<DialogTrigger asChild>
								<Button variant={"ghost"} size={"icon"}>
									<Trash />
									Delete chat
								</Button>
							</DialogTrigger>
							<DialogContent showCloseButton={false}>
								<DialogHeader>
									<DialogTitle>No Close Button</DialogTitle>
									<DialogDescription>
										This dialog doesn&apos;t have a close button in the
										top-right corner.
										<Button variant='destructive'>
											Delete {currentContact?.email}
										</Button>
									</DialogDescription>
								</DialogHeader>
							</DialogContent>
						</Dialog>
						<Dialog>
							<DialogTrigger asChild>
								<Button variant={"ghost"} size={"icon"}>
									<BrushCleaning />
									clear history
								</Button>
							</DialogTrigger>
							<DialogContent showCloseButton={false}>
								<DialogHeader>
									<DialogTitle>No Close Button</DialogTitle>
									<DialogDescription>
										This dialog doesn&apos;t have a close button in the
										top-right corner.
										<Button variant='destructive'>
											Delete {currentContact?.email}
										</Button>
									</DialogDescription>
								</DialogHeader>
							</DialogContent>
						</Dialog>
						<Dialog>
							<DialogTrigger asChild>
								<Button variant={"ghost"} size={"icon"}>
									<Ban />
									Block user
								</Button>
							</DialogTrigger>
							<DialogContent showCloseButton={false}>
								<DialogHeader>
									<DialogTitle>No Close Button</DialogTitle>
									<DialogDescription>
										This dialog doesn&apos;t have a close button in the
										top-right corner.
										<Button variant='destructive'>
											Delete {currentContact?.email}
										</Button>
									</DialogDescription>
								</DialogHeader>
							</DialogContent>
						</Dialog>

						<SheetTitle />
					</SheetHeader>
					<div className='mx-auto w-1/2 h-36 relative'>
						<Avatar className='w-full h-36'>
							<AvatarImage
								src={currentContact?.avatar}
								alt={currentContact?.email}
								className='object-cover'
							/>
							<AvatarFallback className='uppercase'>
								{currentContact?.email[0]}
							</AvatarFallback>
						</Avatar>
					</div>
					<Separator />
					<div className='px-3'>
						<h1 className='text-center text-xl'>{currentContact?.email}</h1>
						<div className='flex flex-col space-y-1'>
							{currentContact?.firstName && (
								<div className='flex items-center gap-1 mt-4'>
									<p>First name:</p>
									<p className='text-muted-foreground'>
										{currentContact.firstName}
									</p>
								</div>
							)}
							{currentContact?.lastName && (
								<div className='flex items-center gap-1 mt-4'>
									<p>Last name:</p>
									<p className='text-muted-foreground'>
										{currentContact.lastName}
									</p>
								</div>
							)}
							{currentContact?.bio && (
								<div className='flex items-center gap-1 mt-4'>
									<p className=''>
										About{" "}
										<span className='text-muted-foreground'>
											{currentContact.bio}
										</span>
									</p>
								</div>
							)}
						</div>
						<Separator />
						<div className='flex flex-col space-y-1'>
							<div className='w-full h-36 relative'>
								<Image
									src={"https://github.com/shadcn.png"}
									alt='media'
									fill
									className='object-cover rounded-md'
								/>
							</div>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
