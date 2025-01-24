"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { WorkoutSet } from "@prisma/client";

type EditSetParams = Pick<WorkoutSet, "id"> &
  Partial<
    Pick<WorkoutSet, "weight" | "reps" | "weightUnitId" | "repetitionUnitId">
  >;

export async function editSet({
  id,
  ...newSetData
}: EditSetParams): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.workoutSet.update({
      where: { id },
      data: {
        ...newSetData,
      },
    });
  } catch (error) {
    console.error(error);
    return false;
  }

  revalidatePath("/routines");
  return true;
}
