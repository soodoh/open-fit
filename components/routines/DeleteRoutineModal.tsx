"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import type { RoutineId } from "@/lib/convex-types";

export const DeleteRoutineModal = ({
  open,
  onClose,
  routineId,
}: {
  open: boolean;
  onClose: () => void;
  routineId: RoutineId;
}) => {
  const deleteRoutine = useMutation(api.mutations.routines.remove);

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workout</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this workout?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            No
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              await deleteRoutine({ id: routineId });
              onClose();
            }}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
