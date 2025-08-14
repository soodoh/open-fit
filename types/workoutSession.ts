import type { SetGroupInclude } from "./workoutSet";
import type { Prisma } from "@/prisma/generated/client";

export type SessionWithRelations = Prisma.WorkoutSessionGetPayload<{
  include: {
    template: { include: { routine: true } };
    setGroups: SetGroupInclude;
  };
}>;
