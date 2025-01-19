/*
  Warnings:

  - Added the required column `name` to the `WorkoutSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutSession" ADD COLUMN     "name" TEXT NOT NULL;
