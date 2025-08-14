"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { WorkoutSet } from "@/prisma/generated/client";

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
