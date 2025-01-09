import {
  Equipment,
  ExerciseCategory,
  ExerciseForce,
  ExerciseLevel,
  ExerciseMechanic,
  MuscleGroup,
  PrismaClient,
} from "@prisma/client";
import exerciseData from "./exercise-db/dist/exercises.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "admin@admin.com",
      password: "adminadmin",
      role: "ADMIN",
    },
  });

  for (const exercise of exerciseData) {
    const mapSnakeCase = (value: string | null) => {
      if (!value) {
        return null;
      }
      return value.replace(/\s+/g, "_").replace(/\W/g, "").toLowerCase();
    };

    await prisma.exercise.create({
      data: {
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
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
