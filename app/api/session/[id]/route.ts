import { getSession } from "@/actions/getSessions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const workoutSession = await prisma.workoutSession.update({
    where: { id: parseInt(id, 10) },
    data: {
      ...body,
    },
  });
  revalidatePath("/logs");
  return Response.json(workoutSession);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.workoutSession.delete({
    where: { id: parseInt(id, 10) },
  });
  revalidatePath("/logs");
  return Response.json(result);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getSession(parseInt(id, 10));
}
