"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const RoutineSchema = z.object({
  name: z.string().min(1, { message: "Routine name is required." }),
  description: z.optional(z.string()),
});

export type RoutineActionState = {
  data: {
    name: string;
    description?: string;
  };
  errors?: {
    name?: string[];
    description?: string[];
  };
};

export async function editRoutine(
  form: FormData,
  routineId?: number,
): Promise<RoutineActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = form.get("name") as string;
  const description = form.get("description") as string;

  const validatedFields = RoutineSchema.safeParse({
    name,
    description,
  });
  if (!validatedFields.success) {
    return {
      data: { name, description },
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.routine.upsert({
      where: { id: routineId ?? -1 },
      update: {
        name,
        description,
      },
      create: {
        userId: session.user.id,
        name,
        description,
      },
    });
  } catch (err) {
    throw err;
  }

  revalidatePath("/routines");
  return {
    data: { name, description },
  };
}
