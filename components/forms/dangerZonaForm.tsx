import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
export default function DangerZonaForm() {
	return (
		<>
			<p className='text-xs text-muted-foreground text-center'>
				Are you sure you want to delete your accound ?{" "}
			</p>
			<Dialog>
				<DialogTrigger asChild>
					<Button className='mt-2 w-full font-bold' variant={"destructive"}>
						Delete permenantly
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</DialogDescription>
					</DialogHeader>
					<Separator />
				</DialogContent>
			</Dialog>
		</>
	);
}
