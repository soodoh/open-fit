"use server";

import { WorkoutSet } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function reorderSets(sets: WorkoutSet[]): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    for (const [index, set] of sets.entries()) {
      await prisma.workoutSet.update({
        where: { id: set.id },
        data: { order: index },
      });
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  const setGroup = await prisma.workoutSetGroup.findUnique({
    where: { id: sets[0].setGroupId },
  });

  revalidatePath(`/day/${setGroup?.routineDayId}`);
  return true;
}
