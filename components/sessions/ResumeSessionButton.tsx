import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SessionWithRelations } from "@/types/workoutSession";

export const ResumeSessionButton = ({
  session,
}: {
  session: SessionWithRelations;
}) => {
  return (
    <Button variant="outline" asChild>
      <Link href={`/logs/${session.id}`}>
        <Play className="mr-2 h-4 w-4" />
        Resume Current Session
      </Link>
    </Button>
  );
};
