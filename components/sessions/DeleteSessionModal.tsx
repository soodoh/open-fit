import { deleteSession } from "@/actions/deleteSession";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export const DeleteSessionModal = ({
  open,
  onClose,
  sessionId,
}: {
  open: boolean;
  onClose: () => void;
  sessionId: number;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-session-title"
      aria-describedby="delete-session-description"
    >
      <DialogTitle id="delete-session-title">Delete Session</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-session-description">
          Are you sure you want to delete this workout session?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={async () => {
            await deleteSession(sessionId);
            onClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
