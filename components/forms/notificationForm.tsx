import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { ChevronDown, PlayCircle, Volume2, VolumeOff } from "lucide-react";
import { SOUNDS } from "@/constants/audio";
import { cn } from "@/lib/utils";
import { useState } from "react";
import useAudio from "@/hook/useAudio";
import { FieldSeparator } from "../ui/field";
import { Switch } from "../ui/switch";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { generateToken } from "@/lib/tokenGenerate";
import { api } from "@/https/axios";
import { IApiResponse } from "@/types";
import { toast } from "sonner";
interface IPayloads {
	muted?: boolean;
	sendingSound?: string;
	notificationSound?: string;
}
export default function NotificationForm() {
	const [isNotificationSound, setIsNotificationSound] = useState(false);
	const [isSendingSound, setIsSendingSound] = useState(false);
	const { playSound } = useAudio();
	const [selectSound, setSelectSound] = useState("");
	const onPlaySound = (sound: string) => {
		setSelectSound(sound);
		playSound(sound);
	};
	const { data: session, update } = useSession();
	const { mutate, isPending } = useMutation({
		mutationFn: async (payloads: IPayloads) => {
			const token = await generateToken(session?.currentUser._id);
			const { data } = await api.put<IApiResponse<any>>(
				"/api/user/profile",
				payloads,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			return data;
		},
		onSuccess: data => {
			setIsSendingSound(false);
			setIsNotificationSound(false);
			toast(data.message);
			update();
		},
	});
	return (
		<>
			<div className='relative flex items-center justify-between'>
				<div className='flex flex-col'>
					<p>Notification Sound</p>
					<p className='text-muted-foreground text-xs'>
						{session?.currentUser.notificationSound}
					</p>

					{/* <p className='text-muted-foreground text-xs'>Apple</p> */}
				</div>
				<Popover
					open={isNotificationSound}
					onOpenChange={setIsNotificationSound}
				>
					<PopoverTrigger asChild>
						<Button size={"sm"} variant='outline'>
							Select <ChevronDown />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-80 absolute right-0'>
						<div className='flex flex-col space-y-1'>
							{SOUNDS.map(sound => (
								<div
									className={cn(
										"flex justify-between items-center bg-secondary cursor-pointer hover:bg-primary-foreground",
										selectSound === sound.value && "bg-primary-foreground",
									)}
									key={sound.label + sound.value}
									onClick={() => onPlaySound(sound.value)}
								>
									<Button
										disabled={isPending}
										size={"sm"}
										variant={"ghost"}
										className='center'
									>
										{sound.label}
									</Button>
									{session?.currentUser.notificationSound === sound.value ? (
										<Button
											disabled={isPending}
											size={"icon"}
											className='center'
										>
											<Volume2 />
										</Button>
									) : (
										<Button
											disabled={isPending}
											size={"icon"}
											variant={"ghost"}
											className='center'
										>
											<PlayCircle />
										</Button>
									)}
								</div>
							))}
							<Button
								type='submit'
								onClick={() => mutate({ notificationSound: selectSound })}
								disabled={isPending}
								className='w-full'
							>
								Submit
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<FieldSeparator className='mb-3' />
			<div className='relative flex items-center justify-between'>
				<div className='flex flex-col'>
					<p>Sending Sound</p>
					<p className='text-muted-foreground text-xs'>
						{session?.currentUser.sendingSound}
					</p>
				</div>
				<Popover open={isSendingSound} onOpenChange={setIsSendingSound}>
					<PopoverTrigger asChild>
						<Button size={"sm"} variant='outline'>
							Select <ChevronDown />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-80 absolute right-0'>
						<div className='flex flex-col space-y-1'>
							{SOUNDS.map(sound => (
								<div
									className={cn(
										"flex justify-between items-center bg-secondary cursor-pointer hover:bg-primary-foreground",
										selectSound === sound.value && "bg-primary-foreground",
									)}
									key={sound.label + sound.value}
									onClick={() => onPlaySound(sound.value)}
								>
									<Button size={"sm"} variant={"ghost"} className='center'>
										{sound.label}
									</Button>
									{session?.currentUser.sendingSound === sound.value ? (
										<Button
											disabled={isPending}
											size={"icon"}
											className='justify-center '
										>
											<Volume2 />
										</Button>
									) : (
										<Button
											disabled={isPending}
											size={"icon"}
											variant={"ghost"}
											className='justify-center'
										>
											<PlayCircle />
										</Button>
									)}
								</div>
							))}
							<Button
								type='submit'
								className='w-full'
								onClick={() => mutate({ sendingSound: selectSound })}
							>
								Submit
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<FieldSeparator className='mb-3' />
			<div className='flex items-center justify-between relative'>
				<div className='flex flex-col'>
					<p>Mode Mute</p>
					<p className='text-muted-foreground text-xs'>
						{session?.currentUser.muted ? "Muted" : "Unmuted"}
					</p>
				</div>
				<Switch
					checked={session?.currentUser.muted}
					disabled={isPending}
					onCheckedChange={() => mutate({ muted: !session?.currentUser.muted })}
				/>
			</div>
		</>
	);
}
