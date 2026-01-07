"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Edit, Play } from "lucide-react";
import { redirect } from "next/navigation";
import { type ReactNode, useState } from "react";
import { DeleteDayModal } from "./DeleteDayModal";
import { EditDayModal } from "./EditDayModal";
import type { RoutineDay, WorkoutSession } from "@/prisma/generated/client";

enum Modal {
  EDIT = "edit",
  DELETE = "delete",
}

export const EditDayMenu = ({
  routineDay,
  currentSession,
  icon,
}: {
  routineDay: RoutineDay;
  currentSession: WorkoutSession | null;
  icon: ReactNode;
}) => {
  const [modal, setModal] = useState<Modal | null>(null);
  const handleClose = () => setModal(null);

  return (
    <>
      <EditDayModal
        open={modal === Modal.EDIT}
        onClose={handleClose}
        routineDay={routineDay}
        routineId={routineDay.routineId}
      />
      <DeleteDayModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        dayId={routineDay.id}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit actions for workout day ${routineDay.id}`}
          >
            {icon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={async () => {
              const response = await fetch("api/session", {
                method: "POST",
                body: JSON.stringify({
                  templateId: routineDay.id,
                }),
              });
              const session = await response.json();
              if (session) {
                redirect(`/logs/${session.id}`);
              }
            }}
            disabled={!!currentSession}
            className="cursor-pointer"
          >
            <Play className="mr-2 h-4 w-4" />
            Start
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
