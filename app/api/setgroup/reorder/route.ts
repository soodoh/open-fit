import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkoutSetGroup } from "@/prisma/generated";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const body = await request.json();
  const updatedSetGroups = await Promise.all(
    body.setGroups.map(
      async ({ id }: Pick<WorkoutSetGroup, "id">, index: number) => {
        return prisma.workoutSetGroup.update({
          where: { id },
          data: { order: index },
        });
      },
    ),
  );

  revalidatePath(`/day/${body.setGroups[0].routineDayId}`);
  return Response.json(updatedSetGroups);
}
