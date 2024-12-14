import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuthFetcher } from "@/lib/fetcher";
import { getSession, SESSIONS } from "@/lib/urls";
import { useSWRConfig } from "swr";
import { WorkoutSession } from "@/types/privateApi/workoutSession";

export const DeleteSessionModal = ({
  open,
  onClose,
  sessionId,
}: {
  open: boolean;
  onClose: () => void;
  sessionId?: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { mutate } = useSWRConfig();

  const deleteSession = async () => {
    const deletePromise = authFetcher(getSession(sessionId), {
      method: "DELETE",
    });
    mutate(SESSIONS, deletePromise, {
      populateCache: (_, cachedSessions) => {
        const newResults =
          cachedSessions?.results?.filter(
            (session: WorkoutSession) => session.id !== sessionId,
          ) ?? [];
        return {
          ...cachedSessions,
          count: newResults.length,
          results: newResults,
        };
      },
      revalidate: false,
      rollbackOnError: true,
    });
  };

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
          onClick={() => {
            deleteSession();
            onClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
