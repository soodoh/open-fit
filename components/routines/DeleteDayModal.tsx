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
import type { RoutineDayId } from "@/lib/convex-types";

export const DeleteDayModal = ({
  open,
  onClose,
  dayId,
}: {
  open: boolean;
  onClose: () => void;
  dayId: RoutineDayId;
}) => {
  const deleteDay = useMutation(api.mutations.routineDays.remove);

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Workout Day</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this day?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            No
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteDay({ id: dayId });
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
