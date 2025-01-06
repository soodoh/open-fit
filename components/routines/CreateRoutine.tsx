"use client";

import { useState } from "react";
import { Add } from "@mui/icons-material";
import { Fab } from "@mui/material";
import { EditRoutineModal as CreateRoutineModal } from "@/components/routines/EditRoutineModal";

export const CreateRoutine = () => {
  const [showEditModal, setEditModal] = useState(false);

  return (
    <>
      <Fab
        color="primary"
        variant="extended"
        onClick={() => setEditModal(true)}
      >
        <Add sx={{ mr: 1 }} />
        Create Routine
      </Fab>

      <CreateRoutineModal
        open={showEditModal}
        onClose={() => setEditModal(false)}
      />
    </>
  );
};
