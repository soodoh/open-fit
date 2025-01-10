"use server";

import { auth } from "@/auth";

export async function updateSetGroupComment(
  setGroupId: number,
  comment: string,
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
}
