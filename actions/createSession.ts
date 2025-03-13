"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { WorkoutSession } from "@prisma/client";
import dayjs from "dayjs";

export async function createSession(
  newSessionData: Partial<WorkoutSession>,
): Promise<WorkoutSession | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const routineDay = newSessionData.templateId
      ? await prisma.routineDay.findUnique({
          where: { id: newSessionData.templateId },
          include: { setGroups: { include: { sets: true } } },
        })
      : null;
    const workoutSession = await prisma.workoutSession.create({
      data: {
        ...newSessionData,
        userId: session.user.id,
        notes: newSessionData.notes ?? "",
        startTime: newSessionData.startTime ?? dayjs().toISOString(),
        name: newSessionData.name ?? routineDay?.description ?? "",
        templateId: newSessionData.templateId,
      },
    });
    revalidatePath("/logs");

    // Clone sets from routineDay template (if templateId was passed)
    if (!routineDay) {
      return workoutSession;
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

    return workoutSession;
  } catch (err) {
    console.error(err);
  }

  return null;
}
