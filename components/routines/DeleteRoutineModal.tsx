import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteRoutineModal = ({
  open,
  onClose,
  routineId,
}: {
  open: boolean;
  onClose: () => void;
  routineId: number;
}) => {
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <form action={async () => {
          await fetch(`/api/routine/${routineId}`, { method: "DELETE" });
          onClose();
        }}>
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
            <Button type="submit" variant="destructive">
              Yes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
