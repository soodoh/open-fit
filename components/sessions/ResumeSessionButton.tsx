import { PlayArrow } from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";

export const ResumeSessionButton = () => {
  return (
    <Button variant="outlined" LinkComponent={Link} href="/logs/current">
      <PlayArrow />
      Resume Current Session
    </Button>
  );
};

