import type { Prisma } from "@prisma/client";
import type { SetGroupInclude } from "./workoutSet";

export type SessionWithRelations = Prisma.WorkoutSessionGetPayload<{
  include: {
    template: { include: { routine: true } };
    setGroups: SetGroupInclude;
  };
}>;
