import type { Prisma } from "@prisma/client";

export type SetInclude = {
  include: { exercise: true; repetitionUnit: true; weightUnit: true };
};

export type SetGroupInclude = {
  include: {
    sets: SetInclude;
  };
};

export type SetGroupWithSets =
  Prisma.WorkoutSetGroupGetPayload<SetGroupInclude>;

export type SetWithUnits = Prisma.WorkoutSetGetPayload<SetInclude>;
