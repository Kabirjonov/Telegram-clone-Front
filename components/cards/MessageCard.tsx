import { cn } from "@/lib/utils";
import React from "react";
interface Props {
	isReceived?: boolean;
}
export default function MessageCard({ isReceived }: Props) {
	return (
		<div
			className={cn(
				"m-2.5 font-medium text-xs flex ",
				isReceived ? "justify-start" : "justify-end",
			)}
		>
			<div
				className={cn(
					"relative inline p-2 pl-2.5 pr-12 max-w-full ",
					isReceived ? "bg-primary" : "bg-secondary",
				)}
			>
				<p className='text-sm text-white'>Hello world</p>
				<span className='text-xs right-1 bottom-0 absolute opacity-60'>c</span>
			</div>
		</div>
	);
}
