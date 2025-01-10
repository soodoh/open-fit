import type { Prisma } from "@prisma/client";

type SetInclude = {
  include: { exercise: true; repetitionUnit: true; weightUnit: true };
};

type SetGroupInclude = {
  include: {
    sets: SetInclude;
  };
};

export type RoutineDayWithSets = Prisma.RoutineDayGetPayload<{
  include: {
    setGroups: SetGroupInclude;
  };
}>;

export type SetGroupWithSets =
  Prisma.WorkoutSetGroupGetPayload<SetGroupInclude>;

export type SetWithUnits = Prisma.WorkoutSetGetPayload<SetInclude>;
