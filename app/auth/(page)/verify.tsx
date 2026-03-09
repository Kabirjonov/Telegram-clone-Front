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
import { otpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
export default function VerifyAuth() {
	const { email } = useAuthStore();
	const form = useForm<z.infer<typeof otpSchema>>({
		resolver: zodResolver(otpSchema),
		defaultValues: { email: email, otp: "" },
	});

	function onSubmit(value: z.infer<typeof otpSchema>) {
		console.log(value);
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
									maxLength={6}
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									aria-invalid={fieldState.invalid}
									containerClassName='justify-center'
									pattern={REGEXP_ONLY_DIGITS}
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
				<Button type='submit' className='w-full ' size={"lg"}>
					Submit
				</Button>
			</form>
		</div>
	);
}
