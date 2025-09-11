import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { type Exercise, PrismaClient, SetType } from "./generated/client";

dotenvExpand.expand(dotenv.config());
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const NUM_ROUTINES = 50;
const NUM_SET_GROUPS = 10;
const NUM_SETS = 4;

async function main() {
  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@admin.com" },
  });
  if (!adminUser) {
    throw new Error("Admin user not found");
  }

  for (let i = 1; i <= NUM_ROUTINES; i++) {
    const routine = await prisma.routine.create({
      data: {
        name: `Routine ${i}`,
        description: `This is routine number ${i}`,
        userId: adminUser.id,
      },
    });
    await prisma.routineDay.createMany({
      data: [
        {
          userId: adminUser.id,
          routineId: routine.id,
          description: `Day 1 of Routine ${i}`,
          weekdays: [1, 3],
        },
        {
          userId: adminUser.id,
          routineId: routine.id,
          description: `Day 2 of Routine ${i}`,
          weekdays: [2, 4],
        },
      ],
    });
  }

  const routineDays = await prisma.routineDay.findMany({
    where: { userId: adminUser.id },
  });
  for (const routineDay of routineDays) {
    for (let i = 1; i <= NUM_SET_GROUPS; i++) {
      await prisma.workoutSetGroup.create({
        data: {
          userId: adminUser.id,
          routineDayId: routineDay.id,
          order: i,
        },
      });
    }
  }

  const setGroups = await prisma.workoutSetGroup.findMany({
    where: { userId: adminUser.id },
  });
  for (const setGroup of setGroups) {
    const [randomExercise] = await prisma.$queryRaw<Exercise[]>`
    SELECT * FROM "Exercise" ORDER BY RANDOM() LIMIT 1;
    `;
    if (!randomExercise) {
      throw new Error("Unable to get random exercise");
    }

    for (let i = 1; i <= NUM_SETS; i++) {
      await prisma.workoutSet.create({
        data: {
          userId: adminUser.id,
          setGroupId: setGroup.id,
          exerciseId: randomExercise.id,
          order: i,
          type: SetType.NORMAL,
          weight: 0,
          weightUnitId: adminUser.defaultWeightUnitId,
          reps: 0,
          repetitionUnitId: adminUser.defaultRepetitionUnitId,
        },
      });
    }
  }
}

main()
  .then(() => {
    console.log("Test data created successfully!");
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
