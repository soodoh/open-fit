-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "SetGroupType" AS ENUM ('NORMAL', 'SUPERSET');

-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('NORMAL', 'WARMUP', 'DROPSET', 'FAILURE');

-- CreateEnum
CREATE TYPE "ExerciseForce" AS ENUM ('push', 'pull', 'static');

-- CreateEnum
CREATE TYPE "ExerciseLevel" AS ENUM ('beginner', 'intermediate', 'expert');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('abdominals', 'chest', 'quadriceps', 'hamstrings', 'glutes', 'adductors', 'abductors', 'calves', 'forearms', 'shoulders', 'biceps', 'triceps', 'traps', 'lats', 'middle_back', 'lower_back', 'neck');

-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('strength', 'cardio', 'stretching', 'plyometrics', 'powerlifting', 'strongman', 'olympic_weightlifting');

-- CreateEnum
CREATE TYPE "ExerciseMechanic" AS ENUM ('compound', 'isolation');

-- CreateEnum
CREATE TYPE "Equipment" AS ENUM ('body_only', 'machine', 'cable', 'foam_roll', 'dumbbell', 'barbell', 'ez_curl_bar', 'kettlebells', 'medicine_ball', 'exercise_ball', 'bands', 'other');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL,
    "password" TEXT NOT NULL,
    "defaultRepetitionUnitId" INTEGER NOT NULL DEFAULT 1,
    "defaultWeightUnitId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoutineDay" (
    "id" SERIAL NOT NULL,
    "routineId" INTEGER NOT NULL,
    "weekdays" "Weekday"[],
    "description" TEXT NOT NULL,

    CONSTRAINT "RoutineDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSetGroup" (
    "id" SERIAL NOT NULL,
    "routineDayId" INTEGER,
    "sessionId" INTEGER,
    "type" "SetGroupType" NOT NULL DEFAULT 'NORMAL',
    "order" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "WorkoutSetGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSet" (
    "id" SERIAL NOT NULL,
    "type" "SetType" NOT NULL DEFAULT 'NORMAL',
    "setGroupId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "repetitionUnitId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weightUnitId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "restTime" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkoutSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "equipment" "Equipment",
    "force" "ExerciseForce",
    "level" "ExerciseLevel" NOT NULL,
    "mechanic" "ExerciseMechanic",
    "primaryMuscles" "MuscleGroup"[],
    "secondaryMuscles" "MuscleGroup"[],
    "instructions" TEXT[],
    "category" "ExerciseCategory" NOT NULL,
    "images" TEXT[],

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepetitionUnit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RepetitionUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeightUnit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WeightUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "impression" INTEGER,
    "notes" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RepetitionUnit_name_key" ON "RepetitionUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WeightUnit_name_key" ON "WeightUnit"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultRepetitionUnitId_fkey" FOREIGN KEY ("defaultRepetitionUnitId") REFERENCES "RepetitionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_defaultWeightUnitId_fkey" FOREIGN KEY ("defaultWeightUnitId") REFERENCES "WeightUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineDay" ADD CONSTRAINT "RoutineDay_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSetGroup" ADD CONSTRAINT "WorkoutSetGroup_routineDayId_fkey" FOREIGN KEY ("routineDayId") REFERENCES "RoutineDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSetGroup" ADD CONSTRAINT "WorkoutSetGroup_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_setGroupId_fkey" FOREIGN KEY ("setGroupId") REFERENCES "WorkoutSetGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_repetitionUnitId_fkey" FOREIGN KEY ("repetitionUnitId") REFERENCES "RepetitionUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_weightUnitId_fkey" FOREIGN KEY ("weightUnitId") REFERENCES "WeightUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSession" ADD CONSTRAINT "WorkoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
