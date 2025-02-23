"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SetGroupType, SetType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createSetGroup({
  sessionOrDayId,
  type,
  exerciseId,
  numSets,
}: {
  sessionOrDayId: number;
  type: "session" | "routineDay";
  exerciseId: number;
  numSets: number;
}) {
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
  if (!Number.isInteger(numSets) || numSets < 1) {
    throw new Error("Invalid number of sets");
  }

  if (type === "routineDay") {
  } else {
  }
  const existingSetGroups = await prisma.workoutSetGroup.findMany({
    where:
      type === "routineDay"
        ? { routineDayId: sessionOrDayId }
        : { sessionId: sessionOrDayId },
  });
  const setGroup = await prisma.workoutSetGroup.create({
    data: {
      ...(type === "routineDay"
        ? { routineDayId: sessionOrDayId }
        : { sessionId: sessionOrDayId }),
      type: SetGroupType.NORMAL,
      order: existingSetGroups.length,
    },
  });
  await prisma.workoutSet.createMany({
    data: Array.from({ length: numSets }, (_, index) => ({
      exerciseId,
      type: SetType.NORMAL,
      order: index,
      setGroupId: setGroup.id,
      reps: 0,
      repetitionUnitId: user.defaultRepetitionUnitId,
      weight: 0,
      weightUnitId: user.defaultWeightUnitId,
    })),
  });
  if (type === "routineDay") {
    revalidatePath(`/day/${sessionOrDayId}`);
  } else {
    revalidatePath(`/logs/${sessionOrDayId}`);
    revalidatePath(`/logs/current`);
  }
}
