import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";
import type { WorkoutSessionWithData } from "@/lib/convex-types";

export const ResumeSessionButton = ({
  session,
}: {
  session: WorkoutSessionWithData;
}) => {
  return (
    <Button variant="outline" asChild>
      <Link href={`/logs/${session._id}`}>
        <Play className="mr-2 h-4 w-4" />
        Resume Current Session
      </Link>
    </Button>
  );
};
