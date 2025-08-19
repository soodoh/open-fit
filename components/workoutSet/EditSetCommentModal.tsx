import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import type { WorkoutSetGroup } from "@/prisma/generated/client";

export const EditSetCommentModal = ({
  open,
  onClose,
  setGroup,
}: {
  open: boolean;
  onClose: () => void;
  setGroup: WorkoutSetGroup;
}) => {
  const [comment, setComment] = useState(setGroup.comment ?? "");

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="update-set-title"
      aria-describedby="update-set-description"
    >
      <DialogTitle id="update-set-title">Update Set Comment</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ mt: 2 }}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          label="Comment"
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={async () => {
            await fetch(`/api/setgroup/${setGroup.id}`, {
              method: "POST",
              body: JSON.stringify({ comment }),
            });
            onClose();
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
