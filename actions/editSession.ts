"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { WorkoutSession } from "@prisma/client";

export async function editSession(
  sessionId: number,
  newSessionData: Partial<Omit<WorkoutSession, "id">>,
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        ...newSessionData,
      },
    });
  } catch (err) {
    console.error(err);
    return false;
  }

  revalidatePath("/logs");
  return true;
}
