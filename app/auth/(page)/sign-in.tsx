import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/hook/useAuth";

import { SignInSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function SignInPage() {
	const { setEmail, setStep } = useAuthStore();
	const form = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
		defaultValues: { email: "" },
	});
	function onSubmit(value: z.infer<typeof SignInSchema>) {
		console.log(value);
		setStep("verify");
		setEmail(value.email);
	}
	return (
		<>
			<p className='text-center text-muted-foreground text-sm '>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat ipsa
				quibusdam beatae aspernatur veritatis nemo repellendus!
			</p>
			<form
				id='form-rhf-demo'
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 mt-2 w-full'
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
									placeholder='info@gmail.com'
									autoComplete='off'
									name='email'
								/>
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
		</>
	);
}
