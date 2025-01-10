"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RepetitionUnit, WeightUnit } from "@prisma/client";

export type Units = {
  repetitionUnits: RepetitionUnit[];
  defaultRepetitionUnit: RepetitionUnit;
  weightUnits: WeightUnit[];
  defaultWeightUnit: WeightUnit;
};

export async function getUnits() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { defaultWeightUnit: true, defaultRepetitionUnit: true },
  });

  const defaultWeightUnit =
    user?.defaultWeightUnit || (await prisma.weightUnit.findFirst({}));
  const weightUnits = await prisma.weightUnit.findMany({});

  const defaultRepetitionUnit =
    user?.defaultRepetitionUnit || (await prisma.repetitionUnit.findFirst({}));
  const repetitionUnits = await prisma.repetitionUnit.findMany({});

  return {
    weightUnits,
    defaultWeightUnit,
    repetitionUnits,
    defaultRepetitionUnit,
  };
}
