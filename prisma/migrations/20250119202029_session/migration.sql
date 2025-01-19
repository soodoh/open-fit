-- CreateEnum
CREATE TYPE "WorkoutRating" AS ENUM ('bad', 'neutral', 'good');

-- AlterTable
ALTER TABLE "WorkoutSet" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "restTime" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WorkoutSetGroup" ADD COLUMN     "sessionId" INTEGER,
ALTER COLUMN "routineDayId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" SERIAL NOT NULL,
    "rating" "WorkoutRating" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutSetGroup" ADD CONSTRAINT "WorkoutSetGroup_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
