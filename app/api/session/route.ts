import { getSessions } from "@/actions/getSessions";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const body = await request.json();
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const routineDay = body.templateId
      ? await prisma.routineDay.findUnique({
          where: { id: body.templateId },
          include: { setGroups: { include: { sets: true } } },
        })
      : null;
    const workoutSession = await prisma.workoutSession.create({
      data: {
        ...body,
        userId: session.user.id,
        notes: body.notes ?? "",
        startTime: body.startTime ?? dayjs().toISOString(),
        name: body.name ?? routineDay?.description ?? "",
        templateId: body.templateId,
      },
    });
    revalidatePath("/logs");

    // Clone sets from routineDay template (if templateId was passed)
    if (!routineDay) {
      return Response.json(workoutSession);
    }
    for (const [
      setGroupOrder,
      setGroupTemplate,
    ] of routineDay.setGroups.entries()) {
      const newSetGroup = await prisma.workoutSetGroup.create({
        data: {
          type: setGroupTemplate.type,
          order: setGroupOrder,
          comment: setGroupTemplate.comment,
          sessionId: workoutSession.id,
        },
      });
      for (const [setOrder, setTemplate] of setGroupTemplate.sets.entries()) {
        await prisma.workoutSet.create({
          data: {
            setGroupId: newSetGroup.id,
            exerciseId: setTemplate.exerciseId,
            order: setOrder,
            type: setTemplate.type,
            weight: setTemplate.weight,
            weightUnitId: setTemplate.weightUnitId,
            reps: setTemplate.reps,
            repetitionUnitId: setTemplate.repetitionUnitId,
          },
        });
      }
    }

    return Response.json(workoutSession);
  } catch (err) {
    console.error(err);
  }
}

export async function GET() {
  const sessions = await getSessions();
  return Response.json(sessions);
}
