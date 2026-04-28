import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authConfig } from "@/config/auth.config";

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(async () => {
			const session = await getServerSession(authConfig);

			if (!session?.user) {
				throw new UploadThingError("Unauthorized");
			}

			return {
				userId: session.user.id,
				email: session.user.email,
			};
		})

		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Uploaded by:", metadata.userId);

			return {
				uploadedBy: metadata.userId,
				url: file.url,
				key: file.key,
			};
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
