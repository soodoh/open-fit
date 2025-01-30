"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const DaySchema = z.object({
  description: z.string().min(1, { message: "A description is required." }),
  weekdays: z.array(z.number().min(1).max(7)),
});

export type DayActionState = {
  data: {
    description: string;
    weekdays: number[];
  };
  errors?: {
    description?: string[];
  };
};

export async function editDay(
  description: string,
  routineId: number,
  weekdays: number[],
  routineDayId?: number,
): Promise<DayActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedFields = DaySchema.safeParse({
    description,
    weekdays,
  });
  if (!validatedFields.success) {
    return {
      data: { description, weekdays },
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.routineDay.upsert({
      where: { id: routineDayId ?? -1 },
      update: {
        description,
        weekdays,
      },
      create: {
        routineId,
        description,
        weekdays,
      },
    });
  } catch (err) {
    throw err;
  }

  revalidatePath("/routines");
  return {
    data: { description, weekdays },
  };
}
