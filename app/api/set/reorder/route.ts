import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const { setIds } = await request.json();
  const updatedSets = await Promise.all(
    setIds.map(async (id: number, index: number) => {
      return prisma.workoutSet.update({
        where: { id },
        data: { order: index },
      });
    }),
  );

  return Response.json(updatedSets);
}
