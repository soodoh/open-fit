import { getUnits } from "@/actions/getUnits";

export async function GET() {
  const units = await getUnits();
  return Response.json(units);
}
