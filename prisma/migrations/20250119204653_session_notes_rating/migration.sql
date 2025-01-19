/*
  Warnings:

  - You are about to drop the column `rating` on the `WorkoutSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkoutSession" DROP COLUMN "rating",
ADD COLUMN     "impression" INTEGER,
ADD COLUMN     "notes" TEXT;

-- DropEnum
DROP TYPE "WorkoutRating";
