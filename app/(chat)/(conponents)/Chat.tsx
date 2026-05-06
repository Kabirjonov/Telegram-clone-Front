"use client";
import React, { useEffect, useRef } from "react";
import ChatLoading from "../../../components/loadings/ChatLoading";
import MessageCard from "@/components/cards/MessageCard";
import { Controller, UseFormReturn } from "react-hook-form";
import z from "zod";
import { messageSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Smile } from "lucide-react";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { useLoading } from "@/hook/useLoading";
import { IMessage } from "@/types";

interface Props {
	messageForm: UseFormReturn<z.infer<typeof messageSchema>>;
	onSendMessage: (values: any) => void;
	messages: IMessage[];
	onReadMessages: () => void;
}
export default function Chat({
	messageForm,
	onSendMessage,
	messages,
	onReadMessages,
}: Props) {
	const { loadMessages } = useLoading();
	const inputRef = useRef<HTMLInputElement | null>(null);
	useEffect(() => {
		onReadMessages();
	}, [messages]);
	const handleSelectEmoji = (emoji: string) => {
		const input = inputRef.current;
		if (!input) return;
		const start = input.selectionStart ?? 0;
		const text = messageForm.getValues("text");
		const end = input.selectionEnd ?? 0;
		const newText = text.slice(0, start) + emoji + text.slice(end);
		messageForm.setValue("text", newText);
		setTimeout(() => {
			input.setSelectionRange(start + emoji.length, start + emoji.length);
		}, 0);
	};
	return (
		<div className='flex flex-col  justify-end z-40 min-h-[92vh] '>
			{loadMessages && <ChatLoading />}
			{messages.length === 0 && (
				<div className='w-full h-[88vh] flex items-center justify-center'>
					<div
						className='text-[100px] cursor-pointer'
						onClick={() => onSendMessage({ text: "Hi" })}
					>
						Hi
					</div>
				</div>
			)}
			{messages.map((message, index) => (
				<MessageCard key={index} message={message} />
			))}

			<form
				onSubmit={messageForm.handleSubmit(onSendMessage)}
				className='w-full flex relative bg-secondary'
			>
				<Button variant={"ghost"} type='button' size={"icon"}>
					<Paperclip />
				</Button>
				<FieldGroup>
					<Controller
						name='text'
						control={messageForm.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<Input
									{...field}
									id='form-rhf-demo-title'
									aria-invalid={fieldState.invalid}
									className='bg-secondary  border border-muted-foreground border-r'
									autoComplete='off'
									name='text'
									placeholder='Message'
									ref={inputRef}
								/>
							</Field>
						)}
					/>
				</FieldGroup>
				<Popover>
					<PopoverTrigger asChild>
						<Button type='button' size={"icon"} variant={"ghost"}>
							<Smile />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='border-none'>
						<PopoverHeader>
							<EmojiPicker
								className='h-72'
								onEmojiSelect={({ emoji }) => {
									handleSelectEmoji(emoji);
								}}
							>
								<EmojiPickerSearch />
								<EmojiPickerContent />
							</EmojiPicker>
						</PopoverHeader>
					</PopoverContent>
				</Popover>

				<Button type='submit'>
					<Send />
				</Button>
			</form>
		</div>
	);
}
