import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { ChevronDown, PlayCircle, VolumeOff } from "lucide-react";
import { SOUNDS } from "@/constants/audio";
import { cn } from "@/lib/utils";
import { useState } from "react";
import useAudio from "@/hook/useAudio";
import { FieldSeparator } from "../ui/field";
import { Switch } from "../ui/switch";
export default function NotificationForm() {
	const { playSound } = useAudio();
	const [selectSound, setSelectSound] = useState("");
	const onPlaySound = (sound: string) => {
		setSelectSound(sound);
		playSound(sound);
	};
	return (
		<>
			<div className='relative flex items-center justify-between'>
				<div className='flex flex-col'>
					<p>Notification Sound</p>
					{/* <p className='text-muted-foreground text-xs'>Apple</p> */}
				</div>
				<Popover>
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
										size={"sm"}
										variant={"ghost"}
										className='justify-start'
									>
										{sound.label}
									</Button>
									<Button
										size={"icon"}
										variant={"ghost"}
										className='justify-start'
									>
										<PlayCircle />
									</Button>
								</div>
							))}
							<Button type='submit' className='w-full'>
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
					{/* <p className='text-muted-foreground text-xs'>Apple</p> */}
				</div>
				<Popover>
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
										size={"sm"}
										variant={"ghost"}
										className='justify-start'
									>
										{sound.label}
									</Button>
									<Button
										size={"icon"}
										variant={"ghost"}
										className='justify-start'
									>
										<PlayCircle />
									</Button>
								</div>
							))}
							<Button type='submit' className='w-full'>
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
					<p className='text-muted-foreground text-xs'>Muted</p>
				</div>
				<Switch />
			</div>
		</>
	);
}
