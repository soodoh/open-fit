import { prisma } from "@/lib/prisma";
import type { Exercise } from "@/prisma/generated";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchTerm = searchParams.get("searchTerm");
  const formattedSearchTerm = searchTerm?.trim().split(/\s+/).join(" & ");
  if (!formattedSearchTerm) {
    // TODO show most popular items if no searchTerm present?
    return Response.json([]);
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
    return Response.json(exercises);
  } catch (err) {
    console.error(err);
    return Response.json([]);
  }
}
