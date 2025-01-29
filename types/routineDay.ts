import type { Prisma } from "@prisma/client";
import type { SetGroupInclude } from "./workoutSet";

export type RoutineDayWithRelations = Prisma.RoutineDayGetPayload<{
  include: {
    routine: true;
    setGroups: SetGroupInclude;
  };
}>;
