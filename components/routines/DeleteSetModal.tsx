import useSWR from "swr";
import { PaginatedResponse } from "@/types/response";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { WorkoutSetType } from "@/types/privateApi/set";

export const DeleteSetModal = ({
  open,
  onClose,
  setId,
}: {
  open: boolean;
  onClose: () => void;
  setId: number;
}) => {
  const authFetcher = useAuthFetcher();

  const { data: set } = useAuthedSWR<WorkoutSetType>(`/set/${setId}`);
  const { data: workoutSets, mutate: mutateSets } = useAuthedSWR<
    PaginatedResponse<WorkoutSetType>
  >(set?.exerciseday ? `/set?exerciseday=${set.exerciseday}` : null);

  const deleteSet = async () => {
    await authFetcher(`/set/${setId}/`, { method: "DELETE" });
    mutateSets({
      ...workoutSets,
      results: workoutSets?.results?.filter((set) => set.id === setId) ?? [],
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-set-title"
      aria-describedby="delete-set-description"
    >
      <DialogTitle id="delete-set-title">Delete Workout Day</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-set-description">
          Are you sure you want to delete this exercise set?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={() => {
            deleteSet();
            onClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
