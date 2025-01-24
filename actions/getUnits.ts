"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RepetitionUnit, WeightUnit } from "@prisma/client";

export type Units = {
  repetitionUnits: RepetitionUnit[];
  weightUnits: WeightUnit[];
};

export async function getUnits(): Promise<Units> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const weightUnits = await prisma.weightUnit.findMany({});
  const repetitionUnits = await prisma.repetitionUnit.findMany({});

  return {
    weightUnits,
    repetitionUnits,
  };
}
