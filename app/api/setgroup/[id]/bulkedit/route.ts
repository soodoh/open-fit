import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { id } = await params;
  const newSetData = await request.json();
  const parentSetGroup = await prisma.workoutSetGroup.findUnique({
    where: { id: parseInt(id, 10) },
    include: { sets: { select: { id: true } } },
  });
  if (!parentSetGroup) {
    throw new Error("Set group not found");
  }
  const updatedSets = await prisma.workoutSet.updateMany({
    where: { id: { in: parentSetGroup.sets.map((set) => set.id) } },
    data: {
      ...newSetData,
    },
  });
  if (parentSetGroup?.routineDayId) {
    revalidatePath(`/day/${parentSetGroup.routineDayId}`);
  }
  if (parentSetGroup?.sessionId) {
    revalidatePath(`/logs/${parentSetGroup.sessionId}`);
  }

  revalidatePath("/routines");

  return Response.json(updatedSets);
}
