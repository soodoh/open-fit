import { getRoutineDay } from "@/actions/getDay";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getRoutineDay(parseInt(id, 10));
}
