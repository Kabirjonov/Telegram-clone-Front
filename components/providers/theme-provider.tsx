"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import NoSSR from "react-no-ssr";
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
const queryClient = new QueryClient();
import { SessionProvider as Session } from "next-auth/react";
export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider {...props}>
			<Session>
				<QueryClientProvider client={queryClient}>
					<NoSSR>{children}</NoSSR>
				</QueryClientProvider>
			</Session>
		</NextThemesProvider>
	);
}
