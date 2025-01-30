/*
  Warnings:

  - The `weekdays` column on the `RoutineDay` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RoutineDay" DROP COLUMN "weekdays",
ADD COLUMN     "weekdays" INTEGER[];

-- DropEnum
DROP TYPE "Weekday";
