"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function deleteSetGroup(setGroupId: number): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.routine.delete({
      where: { id: setGroupId },
    });
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
}
