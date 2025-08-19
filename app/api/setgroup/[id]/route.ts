import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { id } = await params;
  const setGroup = await prisma.workoutSetGroup.delete({
    where: { id: parseInt(id, 10) },
  });
  revalidatePath(`/day/${setGroup.routineDayId}`);

  return Response.json(setGroup);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { id } = await params;
  const { comment } = await request.json();
  const updatedSetGroup = await prisma.workoutSetGroup.update({
    where: { id: parseInt(id, 10) },
    data: { comment },
  });
  revalidatePath(`/day/${updatedSetGroup.routineDayId}`);
  return Response.json(updatedSetGroup);
}
