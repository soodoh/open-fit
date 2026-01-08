"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteSessionModal } from "./DeleteSessionModal";
import { EditSessionModal } from "./EditSessionModal";
import type { WorkoutSessionWithData } from "@/lib/convex-types";

enum Modal {
  EDIT = "edit",
  DELETE = "delete",
}

export const EditSessionMenu = ({
  session,
}: {
  session: WorkoutSessionWithData;
}) => {
  const [modal, setModal] = useState<Modal | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleClose = () => setModal(null);

  useEffect(() => {
    if (modal) {
      setMenuOpen(false);
    }
  }, [modal]);

  return (
    <>
      <DeleteSessionModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        sessionId={session._id}
      />

      <EditSessionModal
        open={modal === Modal.EDIT}
        onClose={handleClose}
        session={session}
      />

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit actions for workout session ${session._id}`}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setModal(Modal.EDIT)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModal(Modal.DELETE)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
