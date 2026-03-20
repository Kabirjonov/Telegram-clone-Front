import { authConfig } from "@/config/auth.config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(authConfig);
	if (!session) {
		return redirect("/auth");
	}
	return <>{children}</>;
}
