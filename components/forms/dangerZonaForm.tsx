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
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { confirmTextSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { generateToken } from "@/lib/tokenGenerate";
import { api } from "@/https/axios";
import { IApiResponse } from "@/types";
import { toast } from "sonner";
export default function DangerZonaForm() {
	const form = useForm<z.infer<typeof confirmTextSchema>>({
		resolver: zodResolver(confirmTextSchema),
		defaultValues: { confirmText: "" },
	});
	function onSubmit(value: z.infer<typeof confirmTextSchema>) {
		mutate();
	}
	const { data: session } = useSession();
	const { mutate, isPending } = useMutation({
		mutationFn: async () => {
			const token = await generateToken(session?.currentUser._id);
			const { data } = await api.delete<IApiResponse<any>>("/api/user/delete", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return data;
		},
		onSuccess: data => {
			signOut();
			toast(data.message);
		},
	});
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
					<form
						id='form-rhf-demo'
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8 mt-2 w-full'
					>
						<FieldGroup>
							<Controller
								name='confirmText'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='form-rhf-demo-title'>
											Delete
										</FieldLabel>
										<Input
											{...field}
											id='form-rhf-demo-title'
											aria-invalid={fieldState.invalid}
											autoComplete='off'
											placeholder='DELETE'
											name='email'
											disabled={isPending}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
						<Button
							type='submit'
							className='w-full '
							disabled={isPending}
							size={"lg"}
						>
							Submit
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
