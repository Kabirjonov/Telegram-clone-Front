"use client";
import { IError } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

const handleQueryError = (error: IError | Error) => {
	console.log("some errors", error);
	const message =
		(error as IError)?.response?.data?.message ||
		error?.message ||
		"Something went wrong";

	toast.error(message);
};
const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onError: handleQueryError,
		},
	},
});

function QueryProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
export default QueryProvider;
