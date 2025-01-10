"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteRoutine(routineId: number): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.routine.delete({
      where: { id: routineId },
    });
  } catch (err) {
    console.error(err);
    return false;
  }

  revalidatePath("/routines");
  return true;
}
