import type { Prisma } from "@/prisma/generated";

export type RoutineWithRelations = Prisma.RoutineGetPayload<{
  include: {
    routineDays: true;
  };
}>;

export type RoutineDayWithRoutine = Prisma.RoutineDayGetPayload<{
  include: { routine: true };
}>;
