"use server";

import { WorkoutSet } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function reorderSets(sets: WorkoutSet[]): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.workoutSetGroup.updateMany({
      where: {
        id: {
          in: sets.map((set) => set.id),
        },
      },
      data: sets.map((set, index) => ({
        id: set.id,
        order: index,
      })),
    });
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
}
