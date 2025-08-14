"use client";

import { EditRoutineModal as CreateRoutineModal } from "@/components/routines/EditRoutineModal";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

export const CreateRoutine = () => {
  const [showEditModal, setEditModal] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        size="medium"
        onClick={() => setEditModal(true)}
      >
        Create
      </Button>

      <CreateRoutineModal
        open={showEditModal}
        onClose={() => setEditModal(false)}
      />
    </>
  );
};
