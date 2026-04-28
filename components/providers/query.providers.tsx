"use client";
import { IError } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

const handleQueryError = (error: IError | Error) => {
	if ((error as IError).response.data.message) {
		return toast.error((error as IError).response.data.message);
	}
	return toast.error("Something went wrong");
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
