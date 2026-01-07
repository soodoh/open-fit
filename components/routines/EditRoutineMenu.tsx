"use client";

import { EditRoutineModal } from "@/components/routines/EditRoutineModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2, Edit, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteRoutineModal } from "./DeleteRoutineModal";
import { EditDayModal as AddDayModal } from "./EditDayModal";
import type { Routine } from "@/prisma/generated/client";

enum Modal {
  EDIT = "edit",
  ADD = "add",
  DELETE = "delete",
}

export const EditRoutineMenu = ({ routine }: { routine: Routine }) => {
  const [modal, setModal] = useState<Modal | null>(null);
  const handleClose = () => setModal(null);

  return (
    <>
      <AddDayModal
        open={modal === Modal.ADD}
        onClose={handleClose}
        routineId={routine.id}
      />
      <EditRoutineModal
        open={modal === Modal.EDIT}
        onClose={handleClose}
        routine={routine}
      />
      <DeleteRoutineModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        routineId={routine.id}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit routine: ${routine.name}`}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setModal(Modal.ADD)} className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add Day
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModal(Modal.EDIT)} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModal(Modal.DELETE)} className="cursor-pointer">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
