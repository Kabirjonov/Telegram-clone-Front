import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from "../ui/skeleton";

interface Props {
	isReceived?: boolean;
}
export default function MessageLoading({ isReceived }: Props) {
	return (
		<div
			className={cn(
				"m-2.5 font-medium text-xs flex",
				isReceived ? "justify-start" : "justify-end",
			)}
		>
			<Skeleton
				className={cn(
					"relative inline p-2 pl-2.5 pr-12",
					isReceived ? "bg-primary/20" : "bg-secondary/20",
				)}
			>
				<Skeleton className='w-36 h-5' />
				<span className='text-xs right-1 bottom-0 absolute opacity-60'>c</span>
			</Skeleton>
		</div>
	);
}
