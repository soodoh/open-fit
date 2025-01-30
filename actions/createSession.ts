"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { WorkoutSession } from "@prisma/client";
import dayjs from "dayjs";

export async function createSession(
  newSessionData: Partial<WorkoutSession>,
  routineDayId?: number,
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const workoutSession = await prisma.workoutSession.create({
      data: {
        ...newSessionData,
        userId: session.user.id,
        name: newSessionData.name ?? "",
        notes: newSessionData.notes ?? "",
        startTime: newSessionData.startTime ?? dayjs().toISOString(),
      },
    });
    revalidatePath("/logs");

    if (!routineDayId) {
      return true;
    }
    const routineDay = await prisma.routineDay.findUnique({
      where: { id: routineDayId },
      include: { setGroups: { include: { sets: true } } },
    });
    if (!routineDay) {
      return true;
    }
    for (const [
      setGroupOrder,
      setGroupTemplate,
    ] of routineDay.setGroups.entries()) {
      const newSetGroup = await prisma.workoutSetGroup.create({
        data: {
          type: setGroupTemplate.type,
          order: setGroupOrder,
          comment: setGroupTemplate.comment,
          sessionId: workoutSession.id,
        },
      });
      for (const [setOrder, setTemplate] of setGroupTemplate.sets.entries()) {
        await prisma.workoutSet.create({
          data: {
            setGroupId: newSetGroup.id,
            exerciseId: setTemplate.exerciseId,
            order: setOrder,
            type: setTemplate.type,
            weight: setTemplate.weight,
            weightUnitId: setTemplate.weightUnitId,
            reps: setTemplate.reps,
            repetitionUnitId: setTemplate.repetitionUnitId,
          },
        });
      }
    }
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
}
