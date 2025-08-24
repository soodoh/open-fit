import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { NextRequest } from "next/server";

const RoutineSchema = z.object({
  name: z.string().min(1, { message: "Routine name is required." }),
  description: z.optional(z.string()),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { id } = await params;
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const validatedFields = RoutineSchema.safeParse({
    name,
    description,
  });
  if (!validatedFields.success) {
    return Response.json(
      {
        data: { name, description },
        errors: validatedFields.error.flatten().fieldErrors,
      },
      { status: 500 },
    );
  }

  const routine = await prisma.routine.update({
    where: { id: parseInt(id, 10) },
    data: {
      name,
      description,
    },
  });

  return Response.json(routine);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { id } = await params;
  const result = await prisma.routine.delete({
    where: { id: parseInt(id, 10) },
  });
  return Response.json(result);
}
