import { prisma } from "@/lib/prisma";
import type { RoutineDayWithRoutine } from "@/types/routine";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchTerm = searchParams.get("searchTerm");
  const formattedSearchTerm = searchTerm?.trim().split(/\s+/).join(" & ");
  if (!formattedSearchTerm) {
    // TODO show most popular items if no searchTerm present?
    const firstTemplates = await prisma.routineDay.findMany({
      // orderBy: { createdAt: "desc" },
      // limit: 10,
      include: { routine: true },
    });
    return Response.json(firstTemplates);
  }
  const searchQuery = `${formattedSearchTerm}:*`;

  try {
    const templates = await prisma.$queryRaw<RoutineDayWithRoutine[]>`
    SELECT "RoutineDay".*, json_build_object(
      'id', "Routine"."id",
      'name', "Routine"."name",
      'description', "Routine"."description"
    ) as routine
    FROM "RoutineDay"
    JOIN "Routine" ON "RoutineDay"."routineId" = "Routine"."id"
    WHERE to_tsvector('english', "RoutineDay"."description" || ' ' || "Routine"."name"::text)
    @@ to_tsquery('english', ${searchQuery});
    `;
    return Response.json(templates);
  } catch (err) {
    console.error(err);
    return Response.json([]);
  }
}
