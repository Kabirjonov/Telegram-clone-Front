import { profileSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function InformationForm() {
	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: { firstName: "", lastName: "", bio: "" },
	});
	const onSubmit = (values: z.infer<typeof profileSchema>) => {
		console.log(values);
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
								<Textarea
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder='Last name'
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>
				<Button type='submit' className='w-full'>
					Submit
				</Button>
			</form>
		</>
	);
}
