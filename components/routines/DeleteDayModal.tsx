import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export const DeleteDayModal = ({
  open,
  onClose,
  dayId,
}: {
  open: boolean;
  onClose: () => void;
  dayId: number;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-day-title"
      aria-describedby="delete-day-description"
    >
      <DialogTitle id="delete-day-title">Delete Workout Day</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-day-description">
          Are you sure you want to delete this day?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
