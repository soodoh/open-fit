import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { WorkoutSet } from "@/prisma/generated/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { id } = await params;
  const newSetData = (await request.json()) as Partial<WorkoutSet>;
  const newSet = await prisma.workoutSet.update({
    where: { id: parseInt(id, 10) },
    data: {
      ...newSetData,
    },
  });
  const parentSetGroup = await prisma.workoutSetGroup.findUnique({
    where: { id: newSet.setGroupId },
  });

  revalidatePath(`/day/${parentSetGroup?.routineDayId}`);
  return Response.json(newSet);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { id } = await params;
  const deletedSet = await prisma.workoutSet.delete({
    where: { id: parseInt(id, 10) },
  });
  const setGroup = await prisma.workoutSetGroup.findUnique({
    where: { id: deletedSet.setGroupId },
  });
  // Revalidate caches
  if (setGroup?.routineDayId) {
    revalidatePath(`/day/${setGroup.routineDayId}`);
  }
  if (setGroup?.sessionId) {
    revalidatePath(`/logs/${setGroup.sessionId}`);
  }

  return Response.json(setGroup);
}
