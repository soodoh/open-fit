"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteSet(setId: number): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const deletedSet = await prisma.workoutSet.delete({
      where: { id: setId },
    });
    const setGroup = await prisma.workoutSetGroup.findUnique({
      where: { id: deletedSet.setGroupId },
    });
    // Revalidate caches
    if (setGroup?.routineDayId) {
      revalidatePath(`/day/${setGroup.routineDayId}`);
    }
    if (setGroup?.sessionId) {
      revalidatePath(`/logs/${setGroup.sessionId}`);
    }
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
}
