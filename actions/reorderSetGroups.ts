"use server";

import { WorkoutSetGroup } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function reorderSetGroups(
  setGroups: WorkoutSetGroup[],
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.workoutSetGroup.updateMany({
      where: {
        id: {
          in: setGroups.map((setGroup) => setGroup.id),
        },
      },
      data: setGroups.map((setGroup, index) => ({
        id: setGroup.id,
        order: index,
      })),
    });
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
}
