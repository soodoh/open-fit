import { getCurrentSession } from "@/actions/getCurrentSession";
import { getSession } from "@/actions/getSessions";
import { getUnits } from "@/actions/getUnits";
import { CurrentSessionPage } from "@/components/sessions/CurrentSessionPage";
import { SessionPage } from "@/components/sessions/SessionPage";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ session: string }>;
}) {
  const { session: sessionParam } = await params;
  const sessionId = parseInt(sessionParam, 10);
  const currentSession = await getCurrentSession();

  if (Number.isNaN(sessionId)) {
    redirect("/logs");
  }

  const session = await getSession(sessionId);
  const units = await getUnits();
  if (!session) {
    redirect("/logs");
  }

  if (session.id === currentSession?.id) {
    return <CurrentSessionPage session={currentSession} units={units} />;
  }
  return <SessionPage session={session} units={units} />;
}
