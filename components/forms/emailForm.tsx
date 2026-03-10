"use client";
import { oldEmailSchema, otpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
export default function EmailForm() {
	const [verify, seVerify] = useState(false);

	const emailForm = useForm<z.infer<typeof oldEmailSchema>>({
		resolver: zodResolver(oldEmailSchema),
		defaultValues: { email: "", oldEmail: "info@gmail.com" },
	});
	// const otpForm = useForm<z.infer<typeof otpSchema>>({
	// 	resolver: zodResolver(otpSchema),
	// 	defaultValues: { email: "info@gmail.com", otp: "" },
	// });
	const otpForm = useForm<z.infer<typeof otpSchema>>({
		resolver: zodResolver(otpSchema),
		defaultValues: { email: "", otp: "" },
	});

	function onVerifySubmit(value: z.infer<typeof otpSchema>) {
		console.log(value);
	}
	function onEmailSubmit(value: z.infer<typeof oldEmailSchema>) {
		// otpForm.setValue("email", value.email);
		seVerify(true);
	}
	return verify ? (
		<form
			id='form-rhf-demo'
			onSubmit={otpForm.handleSubmit(onVerifySubmit)}
			className='space-y-8 mt-2'
		>
			<FieldGroup>
				<Controller
					name='email'
					control={otpForm.control}
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
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>
			<FieldGroup>
				<Controller
					name='otp'
					control={otpForm.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-rhf-demo-title'>
								One-Time password
							</FieldLabel>

							<InputOTP
								id='otp'
								ref={field.ref}
								maxLength={6}
								value={field.value ?? ""}
								onChange={value => field.onChange(value)}
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
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>
			<Button type='submit' className='w-full ' size={"lg"}>
				Submit
			</Button>
		</form>
	) : (
		<form
			onSubmit={emailForm.handleSubmit(onEmailSubmit)}
			className='space-y-2 h-full'
		>
			<FieldGroup>
				<Controller
					name='oldEmail'
					control={emailForm.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Label htmlFor='form-rhf-demo-title'>Current email</Label>
							<Input
								{...field}
								id='form-rhf-demo-title'
								aria-invalid={fieldState.invalid}
								placeholder='info@gmail.com'
								autoComplete='off'
								name='email'
								disabled
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>
			<FieldGroup>
				<Controller
					name='email'
					control={emailForm.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<Label htmlFor='form-rhf-demo-title'>Enter a new email</Label>
							<Input
								{...field}
								id='form-rhf-demo-title'
								aria-invalid={fieldState.invalid}
								autoComplete='off'
								name='email'
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</FieldGroup>
			<Button type='submit' className='w-full ' size={"lg"}>
				Verify email
			</Button>
		</form>
	);
}
