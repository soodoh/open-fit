import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcrypt";
import { exercises } from "./defaultExercises";
import {
  type Equipment,
  type ExerciseCategory,
  type ExerciseForce,
  type ExerciseLevel,
  type ExerciseMechanic,
  type MuscleGroup,
  PrismaClient,
  Role,
} from "./generated/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Repetition Units
  for (const repetitionUnit of [
    "Repetitions",
    "Seconds",
    "Minutes",
    "Miles",
    "Kilometers",
  ]) {
    await prisma.repetitionUnit.upsert({
      where: { name: repetitionUnit },
      update: {},
      create: {
        name: repetitionUnit,
      },
    });
  }
  // Weight Units
  for (const weightUnit of ["lb", "kg", "Body Weight"]) {
    await prisma.weightUnit.upsert({
      where: { name: weightUnit },
      update: {},
      create: {
        name: weightUnit,
      },
    });
  }

  // Admin user
  const hashedPassword = await hash("adminadmin", 10);
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Exercises
  for (const exercise of exercises) {
    const mapSnakeCase = (value: string | null) => {
      if (!value) {
        return null;
      }
      return value.replace(/\s+/g, "_").replace(/\W/g, "").toLowerCase();
    };

    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: {
        name: exercise.name,
        equipment: mapSnakeCase(exercise.equipment) as Equipment | null,
        force: exercise.force as ExerciseForce,
        level: exercise.level as ExerciseLevel,
        mechanic: exercise.mechanic as ExerciseMechanic,
        primaryMuscles: exercise.primaryMuscles.map(
          mapSnakeCase,
        ) as MuscleGroup[],
        secondaryMuscles: exercise.secondaryMuscles.map(
          mapSnakeCase,
        ) as MuscleGroup[],
        instructions: exercise.instructions,
        category: mapSnakeCase(exercise.category) as ExerciseCategory,
        images: exercise.images,
      },
    });
  }
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
