import { getCurrentSession } from "@/actions/getCurrentSession";
import { getSessions } from "@/actions/getSessions";
import { auth } from "@/auth";
import { CreateSessionButton } from "@/components/sessions/CreateSession";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";
import { SessionSummaryCard } from "@/components/sessions/SessionSummaryCard";
import { Container } from "@/components/ui/container";
import { redirect } from "next/navigation";

export default async function Sessions() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const sessions = await getSessions();
  const currentSession = await getCurrentSession();

  return (
    <Container maxWidth="xl">
      <div className="my-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Workout Logs</h1>
        <CreateSessionButton />
      </div>

      {currentSession && (
        <div className="my-8">
          <ResumeSessionButton session={currentSession} />
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {sessions.map((session) => (
          <SessionSummaryCard key={session.id} session={session} />
        ))}
      </div>
    </Container>
  );
}
