"use server";

import { WorkoutSetGroup } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function reorderSetGroups(
  setGroups: WorkoutSetGroup[],
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    for (const [index, setGroup] of setGroups.entries()) {
      await prisma.workoutSetGroup.update({
        where: { id: setGroup.id },
        data: { order: index },
      });
    }
  } catch (err) {
    console.error(err);
    return false;
  }

  revalidatePath(`/day/${setGroups[0].routineDayId}`);
  return true;
}
