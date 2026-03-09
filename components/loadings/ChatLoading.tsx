import React from "react";
import MessageLoading from "./MessageLoading";

export default function ChatLoading() {
	return (
		<div>
			<MessageLoading />
			<MessageLoading isReceived />
			<MessageLoading />
			<MessageLoading isReceived />
			<MessageLoading />
			<MessageLoading isReceived />
			<MessageLoading />
			<MessageLoading isReceived />
		</div>
	);
}
