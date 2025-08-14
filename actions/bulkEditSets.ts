"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { WorkoutSet } from "@/prisma/generated/client";

export async function bulkEditSets(
  setGroupId: number,
  newSetData: Partial<Omit<WorkoutSet, "id">>,
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const parentSetGroup = await prisma.workoutSetGroup.findUnique({
      where: { id: setGroupId },
      include: { sets: { select: { id: true } } },
    });
    if (!parentSetGroup) {
      throw new Error("Set group not found");
    }
    await prisma.workoutSet.updateMany({
      where: { id: { in: parentSetGroup.sets.map((set) => set.id) } },
      data: {
        ...newSetData,
      },
    });
    if (parentSetGroup?.routineDayId) {
      revalidatePath(`/day/${parentSetGroup.routineDayId}`);
    }
    if (parentSetGroup?.sessionId) {
      revalidatePath(`/logs/${parentSetGroup.sessionId}`);
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  revalidatePath("/routines");
  return true;
}
