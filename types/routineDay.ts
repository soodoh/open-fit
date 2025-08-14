import type { SetGroupInclude } from "./workoutSet";
import type { Prisma } from "@/prisma/generated/client";

export type RoutineDayWithRelations = Prisma.RoutineDayGetPayload<{
  include: {
    routine: true;
    setGroups: SetGroupInclude;
  };
}>;
