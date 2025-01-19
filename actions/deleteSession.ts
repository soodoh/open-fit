"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteSession(sessionId: number): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.workoutSession.delete({
      where: { id: sessionId },
    });
  } catch (err) {
    console.error(err);
    return false;
  }

  revalidatePath("/logs");
  return true;
}
