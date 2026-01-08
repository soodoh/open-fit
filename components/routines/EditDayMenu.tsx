"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Edit, Play, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { DeleteDayModal } from "./DeleteDayModal";
import { EditDayModal } from "./EditDayModal";
import type { RoutineDay, WorkoutSessionWithData } from "@/lib/convex-types";

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
  currentSession: WorkoutSessionWithData | null;
  icon: ReactNode;
}) => {
  const router = useRouter();
  const [modal, setModal] = useState<Modal | null>(null);
  const handleClose = () => setModal(null);

  const createSession = useMutation(api.mutations.sessions.createFromTemplate);

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
        dayId={routineDay._id}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit actions for workout day ${routineDay._id}`}
          >
            {icon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={async () => {
              const session = await createSession({
                templateId: routineDay._id,
              });
              if (session) {
                router.push(`/logs/${session}`);
              }
            }}
            disabled={!!currentSession}
            className="cursor-pointer"
          >
            <Play className="mr-2 h-4 w-4" />
            Start
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setModal(Modal.EDIT)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setModal(Modal.DELETE)}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
