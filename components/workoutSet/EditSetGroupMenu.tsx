"use client";

import { DeleteSetGroupModal } from "@/components/routines/DeleteSetGroupModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type SetGroupWithRelations, type Units } from "@/lib/convex-types";
import { Edit, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BulkEditSetModal } from "./BulkEditSetModal";
import { EditSetCommentModal } from "./EditSetCommentModal";

enum Modal {
  BULK_EDIT = "bulkEdit",
  COMMENT = "comment",
  DELETE = "delete",
}

export const EditSetGroupMenu = ({
  setGroup,
  units,
}: {
  setGroup: SetGroupWithRelations;
  units: Units;
}) => {
  const [modal, setModal] = useState<Modal | null>(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => setModal(null);

  useEffect(() => {
    if (modal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, [modal]);

  return (
    <>
      <DeleteSetGroupModal
        open={modal === Modal.DELETE}
        onClose={handleClose}
        setGroup={setGroup}
      />
      <EditSetCommentModal
        open={modal === Modal.COMMENT}
        onClose={handleClose}
        setGroup={setGroup}
      />
      <BulkEditSetModal
        open={modal === Modal.BULK_EDIT}
        onClose={handleClose}
        setGroup={setGroup}
        units={units}
      />

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit actions for set group ${setGroup._id}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setModal(Modal.BULK_EDIT)}>
            <Edit className="mr-2 h-4 w-4" />
            Bulk edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setModal(Modal.COMMENT)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Comment
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
