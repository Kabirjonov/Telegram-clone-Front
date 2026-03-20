"use client";

import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/hook/useAuth";
import { api } from "@/https/axios";
import { otpSchema } from "@/lib/validation";
import { IApiResponse, IError, IUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { signIn } from "next-auth/react";
export default function VerifyAuth() {
	const { email } = useAuthStore();
	const form = useForm<z.infer<typeof otpSchema>>({
		resolver: zodResolver(otpSchema),
		defaultValues: { email: email, otp: "" },
	});
	const router = useRouter();
	const { isPaused, mutate } = useMutation({
		mutationFn: async (otp: string) => {
			const { data } = await api.post<IApiResponse<IUser>>("/api/auth/verify", {
				email,
				otp,
			});
			return data;
		},
		onSuccess: async data => {
			toast.success(data.message);
			const response = await signIn("credentials", {
				email: data.body.email,
				redirect: false,
				callbackUrl: "/",
			});

			if (response?.error) {
				toast.error("Authentication failed");
				return;
			}

			router.push(response?.url ?? "/");
		},
		onError: error => {
			console.log(error);
			// toast.error(error.response.data.message);
		},
	});

	function onSubmit(value: z.infer<typeof otpSchema>) {
		mutate(value.otp);
	}

	return (
		<div className='w-full'>
			<p className='text-center text-muted-foreground text-sm'>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt,
				illum?
			</p>
			<form
				id='form-rhf-demo'
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 mt-2'
			>
				<FieldGroup>
					<Controller
						name='email'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='form-rhf-demo-title'>Email</FieldLabel>
								<Input
									{...field}
									id='form-rhf-demo-title'
									aria-invalid={fieldState.invalid}
									autoComplete='off'
									name='email'
									disabled={true}
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
						name='otp'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='form-rhf-demo-title'>
									One-Time password
								</FieldLabel>

								<InputOTP
									id='otp'
									ref={field.ref}
									maxLength={6}
									value={field.value}
									onChange={value => field.onChange(value)}
									onBlur={field.onBlur}
									aria-invalid={fieldState.invalid}
									containerClassName='justify-center'
									pattern={REGEXP_ONLY_DIGITS}
									disabled={isPaused}
								>
									<InputOTPGroup className='w-full rounded-none'>
										<InputOTPSlot
											className='w-full h-10 dark:bg-primary-foreground bg-secondary rounded-none'
											index={0}
										/>
										<InputOTPSlot
											className='w-full h-10 dark:bg-primary-foreground bg-secondary'
											index={1}
										/>
										<InputOTPSlot
											className='w-full h-10 dark:bg-primary-foreground bg-secondary'
											index={2}
										/>
										<InputOTPSeparator className='w-full h-10 flex items-center justify-center' />
										<InputOTPSlot
											className='w-full h-10 dark:bg-primary-foreground bg-secondary'
											index={3}
										/>
										<InputOTPSlot
											className='w-full h-10 dark:bg-primary-foreground bg-secondary'
											index={4}
										/>
										<InputOTPSlot
											className='w-full h-10 dark:bg-primary-foreground bg-secondary'
											index={5}
										/>
									</InputOTPGroup>
								</InputOTP>
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
					size={"lg"}
					disabled={isPaused}
				>
					Submit
				</Button>
			</form>
		</div>
	);
}
