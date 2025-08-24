import { getRoutines } from "@/actions/getRoutines";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { NextRequest } from "next/server";

const RoutineSchema = z.object({
  name: z.string().min(1, { message: "Routine name is required." }),
  description: z.optional(z.string()),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { name, description } = await request.json();

  const validatedFields = RoutineSchema.safeParse({
    name,
    description,
  });
  if (!validatedFields.success) {
    return Response.json(
      {
        name,
        description,
        errors: validatedFields.error.flatten().fieldErrors,
      },
      { status: 500 },
    );
  }

  const routine = await prisma.routine.create({
    data: {
      userId: session.user.id,
      name,
      description,
    },
  });

  revalidatePath("/routines");
  return Response.json(routine);
}

export async function GET() {
  const routines = await getRoutines();
  return routines;
}
