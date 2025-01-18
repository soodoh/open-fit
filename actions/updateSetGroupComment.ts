"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSetGroupComment(
  setGroupId: number,
  comment: string,
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const updatedSetGroup = await prisma.workoutSetGroup.update({
    where: { id: setGroupId },
    data: { comment },
  });
  revalidatePath(`/day/${updatedSetGroup.routineDayId}`);
}
