"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteDay(routineDayId: number): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.routineDay.delete({
      where: { id: routineDayId },
    });
  } catch (err) {
    console.log(err);
    return false;
  }

  revalidatePath("/routines");
  return true;
}
