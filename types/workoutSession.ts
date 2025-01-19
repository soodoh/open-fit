import type { Prisma } from "@prisma/client";
import type { SetGroupInclude } from "./workoutSet";

export type SessionWithSets = Prisma.WorkoutSessionGetPayload<{
  include: {
    setGroups: SetGroupInclude;
  };
}>;
