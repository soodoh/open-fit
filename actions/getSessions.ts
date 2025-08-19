import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SessionWithRelations } from "@/types/workoutSession";

export async function getSessions(): Promise<SessionWithRelations[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const sessions = await prisma.workoutSession.findMany({
    orderBy: { startTime: "desc" },
    where: { userId: session.user.id },
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
  return sessions;
}

export async function getSession(
  id: number,
): Promise<SessionWithRelations | null> {
  const authSession = await auth();
  // TODO handle auth if fetching session owned by different user (unless Admin)
  if (!authSession?.user?.id) {
    throw new Error("Unauthorized");
  }

  const session = await prisma.workoutSession.findUnique({
    where: { id },
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
  return session;
}
