import { PlayArrow } from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";
import type { SessionWithRelations } from "@/types/workoutSession";

export const ResumeSessionButton = ({
  session,
}: {
  session: SessionWithRelations;
}) => {
  return (
    <Button
      variant="outlined"
      LinkComponent={Link}
      href={`/logs/${session.id}`}
    >
      <PlayArrow />
      Resume Current Session
    </Button>
  );
};
