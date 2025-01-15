"use server";

import { prisma } from "@/lib/prisma";
import type { Exercise } from "@prisma/client";

export async function searchExercise(searchTerm: string): Promise<Exercise[]> {
  const formattedSearchTerm = searchTerm.trim().split(/\s+/).join(" & ");
  if (!formattedSearchTerm) {
    // TODO show most popular items if no searchTerm present?
    return [];
  }
  const searchQuery = `${formattedSearchTerm}:*`;

  // TODO use this query whenever primaryMuscles is split into it's own table
  // const query = `
  // SELECT * FROM "Exercise"
  // JOIN "Muscles" ON "Exercise"."primaryMuscles" = "Muscles"."id"
  // WHERE to_tsvector('english', "Exercise"."name" || ' ' || "Muscles"."name"::text) @@ to_tsquery('english', ${searchQuery});
  // `;

  try {
    const exercises = await prisma.$queryRaw<Exercise[]>`
    SELECT * FROM "Exercise"
    WHERE to_tsvector('english', "Exercise"."name" || ' ' || "Exercise"."primaryMuscles"::text)
    @@ to_tsquery('english', ${searchQuery});
    `;
    return exercises;
  } catch (err) {
    console.error(err);
    return [];
  }
}
