"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { WorkoutSet } from "@prisma/client";

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
      revalidatePath("/logs/current");
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  revalidatePath("/routines");
  return true;
}
