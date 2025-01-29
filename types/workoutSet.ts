import type { Prisma } from "@prisma/client";

export type SetInclude = {
  include: { exercise: true; repetitionUnit: true; weightUnit: true };
};

export type SetGroupInclude = {
  include: {
    sets: SetInclude;
  };
};

export type SetGroupWithRelations =
  Prisma.WorkoutSetGroupGetPayload<SetGroupInclude>;

export type SetWithRelations = Prisma.WorkoutSetGetPayload<SetInclude>;

export type SetWithNumber = { set: SetWithRelations; setNum: number };
