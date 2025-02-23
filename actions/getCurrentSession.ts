"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export async function getCurrentSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const currentSession = await prisma.workoutSession.findFirst({
    where: {
      userId: session.user.id,
      // startTime: { gte: dayjs().subtract(1, "day").toDate() },
      endTime: null,
    },
    include: {
      template: { include: { routine: true } },
      setGroups: {
        orderBy: { order: "asc" },
        include: {
          sets: {
            orderBy: { order: "asc" },
            include: { exercise: true, repetitionUnit: true, weightUnit: true },
          },
        },
      },
    },
  });
  return currentSession;
}
