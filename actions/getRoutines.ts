import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { RoutineWithRelations } from "@/types/routine";

export async function getRoutines(): Promise<RoutineWithRelations[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const routines = await prisma.routine.findMany({
    orderBy: { updatedAt: "desc" },
    where: { userId: session.user.id },
    include: { routineDays: true },
  });
  return routines;
}
