import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/hook/useAuth";
import { api } from "@/https/axios";

import { emailSchema } from "@/lib/validation";
import { IApiResponse, IError, IUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function SignInPage() {
	const { setEmail, setStep } = useAuthStore();
	const form = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: "" },
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (email: string) => {
			const { data } = await api.post<IApiResponse<IUser>>("/api/auth/login", {
				email,
			});
			return data;
		},
		onSuccess: data => {
			setEmail(data.body?.email);
			setStep("verify");
			toast.success(data.message);
		},
		onError: (error: IError) => {
			toast.error(error.response.data.message || "Something want wrong");
		},
	});
	function onSubmit(value: z.infer<typeof emailSchema>) {
		mutate(value.email);
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
					size={"lg"}
					disabled={isPending}
				>
					Submit
				</Button>
			</form>
		</>
	);
}
