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
import { getSet, getSets } from "@/lib/urls";
import { useSWRConfig } from "swr";

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

  const { mutate } = useSWRConfig();
  const { data: set } = useAuthedSWR<WorkoutSetType>(getSet(setId));

  const deleteSet = async () => {
    const deletePromise = authFetcher(getSet(setId), { method: "DELETE" });
    mutate(getSets(set?.exerciseday), deletePromise, {
      populateCache: (_, cachedSets) => ({
        ...cachedSets,
        results:
          cachedSets?.results?.filter(
            (set: WorkoutSetType) => set.id !== setId,
          ) ?? [],
      }),
      revalidate: false,
      rollbackOnError: true,
    });
  };

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
