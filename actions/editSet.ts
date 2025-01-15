"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import type { WorkoutSet } from "@prisma/client";

export async function editSet({
  id,
  weight,
  reps,
  weightUnitId,
  repetitionUnitId,
}: Pick<
  WorkoutSet,
  "id" | "weight" | "reps" | "weightUnitId" | "repetitionUnitId"
>): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.workoutSet.update({
      where: { id },
      data: {
        weight,
        reps,
        weightUnitId,
        repetitionUnitId,
      },
    });
  } catch (error) {
    console.error(error);
    return false;
  }

  revalidatePath("/routines");
  return true;
}
