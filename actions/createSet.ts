"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSet(setGroupId: number, exerciseId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const setGroup = await prisma.workoutSetGroup.findUnique({
    where: { id: setGroupId },
    include: { sets: true },
  });
  if (!setGroup) {
    throw new Error("Set group not found");
  }

  const newSet = await prisma.workoutSet.create({
    data: {
      setGroupId,
      exerciseId,
      weight: 0,
      weightUnitId: user.defaultWeightUnitId,
      reps: 0,
      repetitionUnitId: user.defaultRepetitionUnitId,
      order: setGroup.sets.length,
    },
  });
  revalidatePath(`/day/${setGroup.routineDayId}`);
  return newSet;
}
