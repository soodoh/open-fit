import { Workout } from "@/types/privateApi/workout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "@/styles/routinePage.module.css";

export const EditRoutineModal = ({
  open,
  routine,
  saveRoutine,
  onClose,
}: {
  open: boolean;
  routine: Workout | null;
  saveRoutine: (input: Pick<Workout, "name" | "description">) => Promise<void>;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(routine?.name ?? "");
    setDescription(routine?.description ?? "");
  }, [routine]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          saveRoutine({ name, description });
        },
      }}
    >
      <DialogTitle>{routine ? "Edit Routine" : "New Routine"}</DialogTitle>
      <DialogContent className={styles.editRoutine}>
        <TextField
          autoFocus
          id="routine-name"
          variant="filled"
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          variant="filled"
          multiline
          rows={4}
          label="Description"
          value={description}
          placeholder="Routine description"
          onChange={(event) => setDescription(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
