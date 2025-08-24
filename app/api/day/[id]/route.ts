import { getRoutineDay } from "@/actions/getDay";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getRoutineDay(parseInt(id, 10));
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
  const routineDay = await prisma.routineDay.delete({
    where: { id: parseInt(id, 10) },
  });

  return Response.json(routineDay);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const DaySchema = z.object({
    routineId: z.number().int(),
    description: z.string().min(1, { message: "A description is required." }),
    weekdays: z.array(z.number().int().min(1).max(7)),
  });

  const { id } = await params;
  const { routineId, description, weekdays } = await request.json();
  const validatedFields = DaySchema.safeParse({
    routineId,
    description,
    weekdays,
  });
  if (!validatedFields.success) {
    return Response.json(
      {
        description,
        weekdays,
        errors: validatedFields.error.flatten().fieldErrors,
      },
      { status: 500 },
    );
  }

  const routineDay = await prisma.routineDay.update({
    where: { id: parseInt(id, 10) },
    data: {
      routineId,
      description,
      weekdays,
    },
  });

  return routineDay;
}
