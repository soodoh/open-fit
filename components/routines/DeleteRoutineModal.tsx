import { deleteRoutine } from "@/actions/deleteRoutine";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

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
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-routine-title"
      aria-describedby="delete-routine-description"
      PaperProps={{
        component: "form",
        action: async () => {
          await deleteRoutine(routineId);
          onClose();
        },
      }}
    >
      <DialogTitle id="delete-routine-title">Delete Workout</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-routine-description">
          Are you sure you want to delete this workout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button type="submit">Yes</Button>
      </DialogActions>
    </Dialog>
  );
};
