import { getCurrentSession } from "@/actions/getCurrentSession";

export async function GET() {
  const currentSession = await getCurrentSession();
  return Response.json(currentSession);
}
