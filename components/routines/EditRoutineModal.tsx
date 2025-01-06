import { editRoutine, type RoutineActionState } from "@/actions/editRoutine";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { Routine } from "@prisma/client";
import { useActionState } from "react";

export const EditRoutineModal = ({
  open,
  onClose,
  routine,
}: {
  routine?: Routine;
  open: boolean;
  onClose: () => void;
}) => {
  const [state, action, isPending] = useActionState(
    async (_prevState: RoutineActionState, formData: FormData) => {
      const nextState = await editRoutine(formData, routine?.id);
      if (!nextState.errors) {
        onClose();
      }
      return nextState;
    },
    {
      data: {
        name: routine?.name ?? "",
        description: routine?.description ?? "",
      },
    },
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        action,
      }}
    >
      <DialogTitle>{routine ? "Edit Routine" : "New Routine"}</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          id="routine-name"
          variant="filled"
          label="Name"
          name="name"
          placeholder="Routine name"
          required
          error={!!state.errors?.name}
          helperText={state.errors?.name?.[0]}
          defaultValue={state.data.name}
        />
        <TextField
          variant="filled"
          multiline
          rows={4}
          label="Description"
          placeholder="Routine description"
          name="description"
          error={!!state.errors?.description}
          helperText={state.errors?.description?.[0]}
          defaultValue={state.data.description}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isPending}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
