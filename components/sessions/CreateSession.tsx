"use client";

import { EditSessionModal as NewSessionModal } from "@/components/sessions/EditSessionModal";
import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { useState } from "react";

export const CreateSessionButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NewSessionModal open={open} onClose={() => setOpen(false)} />

      <Fab
        color="primary"
        variant="extended"
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        <Add sx={{ mr: 1 }} />
        Create Session
      </Fab>
    </>
  );
};
