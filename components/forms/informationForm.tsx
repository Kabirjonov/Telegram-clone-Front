"use client";
import { profileSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IApiResponse, IUser } from "@/types";
import { api } from "@/https/axios";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { generateToken } from "@/lib/tokenGenerate";

export default function InformationForm() {
	const { data: session, update } = useSession();
	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: session?.currentUser.firstName || "",
			lastName: session?.currentUser.lastName || "",
			bio: session?.currentUser.bio || "",
		},
	});
	console.log(session?.currentUser._id);
	const { mutate, isPaused } = useMutation({
		mutationFn: async (values: z.infer<typeof profileSchema>) => {
			const token = await generateToken(session?.currentUser._id!);
			const { data } = await api.put<IApiResponse<IUser>>(
				"/api/user/profile",
				values,
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			return data;
		},
		onSuccess: data => {
			toast.success(data.message);
			update();
		},
	});
	const onSubmit = (values: z.infer<typeof profileSchema>) => {
		mutate(values);
	};
	return (
		<>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 h-full'>
				<FieldGroup>
					<Controller
						name='firstName'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<Label htmlFor='form-rhf-demo-title'>First name</Label>
								<Input
									{...field}
									id='form-rhf-demo-title'
									aria-invalid={fieldState.invalid}
									placeholder='Fist name'
									autoComplete='off'
									disabled={isPaused}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
				<FieldGroup>
					<Controller
						name='lastName'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<Label htmlFor={field.name}>Last name</Label>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder='Last name'
									disabled={isPaused}
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
				<FieldGroup>
					<Controller
						name='bio'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<Label htmlFor={field.name}>Bio</Label>
								<Textarea
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder='Bio'
									disabled={isPaused}
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
					className='w-full cursor-pointer'
					disabled={isPaused}
				>
					Submit
				</Button>
			</form>
		</>
	);
}
