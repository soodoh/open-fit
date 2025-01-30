"use client";

import { EditSessionModal as NewSessionModal } from "@/components/sessions/EditSessionModal";
import { Add } from "@mui/icons-material";
import { Button, Fab } from "@mui/material";
import { useState } from "react";

export const CreateSessionButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NewSessionModal open={open} onClose={() => setOpen(false)} />

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
      >
        Create
      </Button>
    </>
  );
};
