import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { RoutineDayWithRelations } from "@/types/routineDay";

export async function getRoutineDay(
  id: number,
): Promise<RoutineDayWithRelations | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const routineDay = await prisma.routineDay.findUnique({
    where: { id },
    include: {
      routine: true,
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
  return routineDay;
}
