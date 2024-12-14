import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { WorkoutSetType } from "@/types/privateApi/set";
import { useEffect, useState } from "react";
import { getSet } from "@/lib/urls";

export const EditSetCommentModal = ({
  open,
  onClose,
  setId,
}: {
  open: boolean;
  onClose: () => void;
  setId?: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: set, mutate } = useAuthedSWR<WorkoutSetType>(getSet(setId));
  const [comment, setComment] = useState(set?.comment ?? "");

  useEffect(() => {
    if (open && set?.comment) {
      setComment(set.comment);
    }
  }, [open, set?.comment]);

  const updateSet = async () => {
    const newSet = authFetcher(getSet(setId), {
      method: "PATCH",
      body: JSON.stringify({
        comment,
      }),
    });
    mutate(newSet, {
      optimisticData: (cachedSet) => ({
        ...cachedSet,
        comment,
      }),
      revalidate: true,
      rollbackOnError: true,
    });
  };

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
          onClick={() => {
            updateSet();
            onClose();
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
