import type { Prisma } from "@/prisma/generated";

export type RoutineWithRelations = Prisma.RoutineGetPayload<{
  include: {
    routineDays: true;
  };
}>;
