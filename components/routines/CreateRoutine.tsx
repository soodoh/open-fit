"use client";

import { useState } from "react";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { EditRoutineModal as CreateRoutineModal } from "@/components/routines/EditRoutineModal";

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
