import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SignInSchema } from "@/lib/validation";
import { Controller, UseFormReturn } from "react-hook-form";
import { FaTelegram } from "react-icons/fa";
import z from "zod";

interface Props {
	contactForm: UseFormReturn<{ email: string }>;
	onCreateContact: (values: any) => void;
}
export default function AddContact({ contactForm, onCreateContact }: Props) {
	return (
		<div className='h-screen w-full flex z-40 relative'>
			<div className='flex justify-center items-center z-50 w-full'>
				<div className='flex flex-col  items-center gap-4'>
					<FaTelegram size={120} className='text-blue-500' />
					<h1 className='text-3xl font-bold'>Add contact to start chatting</h1>
					<form
						onSubmit={contactForm.handleSubmit(onCreateContact)}
						className='w-full'
					>
						<FieldGroup>
							<Controller
								name='email'
								control={contactForm.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='form-rhf-demo-title'>Email</FieldLabel>
										<Input
											{...field}
											id='form-rhf-demo-title'
											aria-invalid={fieldState.invalid}
											placeholder='info@gmail.com'
											autoComplete='off'
											className='bg-secondary'
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
						<Button className='mt-2 w-full' type='submit'>
							Submit
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
