import { deleteSetGroup } from "@/actions/deleteSetGroup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { WorkoutSetGroup } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const DeleteSetGroupModal = ({
  open,
  onClose,
  setGroup,
}: {
  open: boolean;
  onClose: () => void;
  setGroup: WorkoutSetGroup;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-set-title"
      aria-describedby="delete-set-description"
    >
      <DialogTitle id="delete-set-title">Delete Set</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-set-description">
          Are you sure you want to delete this exercise set?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={async () => {
            await deleteSetGroup(setGroup.id);
            revalidatePath(`/day/${setGroup.routineDayId}`);
            onClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
