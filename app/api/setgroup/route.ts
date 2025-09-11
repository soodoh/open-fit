import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SetGroupType, SetType } from "@/prisma/generated/client";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { sessionOrDayId, type, exerciseId, numSets } = await request.json();
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (!Number.isInteger(numSets) || numSets < 1) {
    throw new Error("Invalid number of sets");
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
      userId,
      type: SetGroupType.NORMAL,
      order: existingSetGroups.length,
    },
  });
  await prisma.workoutSet.createMany({
    data: Array.from({ length: numSets }, (_, index) => ({
      userId,
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
  }

  return Response.json(setGroup);
}
