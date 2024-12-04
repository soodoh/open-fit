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
  deleteRoutine,
}: {
  open: boolean;
  onClose: () => void;
  deleteRoutine: () => Promise<void>;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-routine-title"
      aria-describedby="delete-routine-description"
    >
      <DialogTitle id="delete-routine-title">Delete Workout</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-routine-description">
          Are you sure you want to delete this workout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={() => {
            deleteRoutine();
            onClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
