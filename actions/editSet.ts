"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { WorkoutSet } from "@prisma/client";

type EditSetParams = Pick<WorkoutSet, "id"> & Partial<WorkoutSet>;

export async function editSet({
  id,
  ...newSetData
}: EditSetParams): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const newSet = await prisma.workoutSet.update({
      where: { id },
      data: {
        ...newSetData,
      },
    });
    const parentSetGroup = await prisma.workoutSetGroup.findUnique({
      where: { id: newSet.setGroupId },
    });
    revalidatePath(`/day/${parentSetGroup?.routineDayId}`);
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
}
