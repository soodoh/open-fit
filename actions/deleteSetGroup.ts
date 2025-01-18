"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteSetGroup(setGroupId: number): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const setGroup = await prisma.workoutSetGroup.delete({
      where: { id: setGroupId },
    });
    revalidatePath(`/day/${setGroup.routineDayId}`);
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
}
