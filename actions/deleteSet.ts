"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteSet(
  routineDayId: number,
  setId: number,
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.workoutSet.delete({
      where: { id: setId },
    });
  } catch (err) {
    console.error(err);
    return false;
  }

  revalidatePath(`/day/${routineDayId}`);
  return true;
}
