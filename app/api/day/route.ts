import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import z from "zod";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const DaySchema = z.object({
    routineId: z.number().int(),
    description: z.string().min(1, { message: "A description is required." }),
    weekdays: z.array(z.number().min(1).max(7)),
  });

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

  const routineDay = await prisma.routineDay.create({
    data: {
      userId,
      routineId,
      description,
      weekdays,
    },
  });

  return routineDay;
}
