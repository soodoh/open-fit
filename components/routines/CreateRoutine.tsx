"use client";

import { EditRoutineModal as CreateRoutineModal } from "@/components/routines/EditRoutineModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export const CreateRoutine = () => {
  const [showEditModal, setEditModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setEditModal(true)}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Create
      </Button>

      <CreateRoutineModal
        open={showEditModal}
        onClose={() => setEditModal(false)}
      />
    </>
  );
};
