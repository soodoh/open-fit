import { getCurrentSession } from "@/actions/getCurrentSession";
import { getRoutines } from "@/actions/getRoutines";
import { auth } from "@/auth";
import { CreateRoutine } from "@/components/routines/CreateRoutine";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";
import { Container } from "@/components/ui/container";
import { redirect } from "next/navigation";

export default async function Routines() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const routines = await getRoutines();
  const currentSession = await getCurrentSession();

  return (
    <Container maxWidth="xl" className="my-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Routines</h1>
        <CreateRoutine />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {currentSession && (
          <div className="col-span-full">
            <ResumeSessionButton session={currentSession} />
          </div>
        )}
        {routines?.map((routine) => (
          <RoutineCard
            key={`routine-${routine.id}`}
            routine={routine}
            currentSession={currentSession}
          />
        ))}
      </div>
    </Container>
  );
}
