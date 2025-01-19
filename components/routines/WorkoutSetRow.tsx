import { deleteSet } from "@/actions/deleteSet";
import { editSet } from "@/actions/editSet";
import type { Units } from "@/actions/getUnits";
import type { SetWithUnits } from "@/types/workoutSet";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Delete, DragHandle } from "@mui/icons-material";
import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState } from "react";

export const WorkoutSetRow = ({
  set,
  units,
}: {
  set: SetWithUnits;
  units: Units;
}) => {
  const [reps, setReps] = useState<string>(`${set.reps}`);
  const [repUnit, setRepUnit] = useState<string>(`${set.repetitionUnitId}`);
  const [weight, setWeight] = useState<string>(`${set.weight}`);
  const [weightUnit, setWeightUnit] = useState<string>(`${set.weightUnitId}`);
  const [edit, setEdit] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: set.id });

  const handleSubmit = async () => {
    await editSet({
      id: set.id,
      weight: parseFloat(weight),
      weightUnitId: parseInt(weightUnit, 10),
      reps: parseInt(reps, 10),
      repetitionUnitId: parseInt(repUnit, 10),
    });
    setEdit(false);
  };

  const dragHandle = (
    <ListItemIcon>
      <IconButton
        sx={{ mx: 2, touchAction: "manipulation" }}
        {...attributes}
        {...listeners}
      >
        <DragHandle />
      </IconButton>
    </ListItemIcon>
  );

  if (!edit) {
    return (
      <ListItem
        dense
        disablePadding
        ref={setNodeRef}
        sx={{ transform: CSS.Transform.toString(transform), transition }}
        secondaryAction={
          <IconButton onClick={() => deleteSet(set.id)}>
            <Delete />
          </IconButton>
        }
      >
        <ListItemButton onClick={() => setEdit(true)} disableGutters>
          {dragHandle}
          <ListItemText
            primary={`${set.reps} ${set.repetitionUnit.name}`}
            secondary={`${set.weight} ${set.weightUnit.name}`}
          />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <ListItem
      dense
      disablePadding
      ref={setNodeRef}
      sx={{ transform: CSS.Transform.toString(transform), transition }}
      component="form"
      action={handleSubmit}
      secondaryAction={
        <IconButton type="submit">
          <Check />
        </IconButton>
      }
    >
      {dragHandle}

      <Box sx={{ display: "flex", gap: 2, my: 1 }}>
        <TextField
          size="small"
          variant="outlined"
          type="number"
          label="Reps"
          slotProps={{
            htmlInput: { min: 0 },
          }}
          value={reps}
          onChange={(event) => setReps(event.target.value)}
          sx={{ width: 75 }}
        />

        <TextField
          size="small"
          select
          label="Type"
          value={repUnit}
          onChange={(event) => setRepUnit(event.target.value)}
          sx={{ minWidth: 100, maxWidth: 150 }}
        >
          {units.repetitionUnits.map((unit) => (
            <MenuItem key={`repUnit-${unit.id}`} value={unit.id}>
              {unit.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          variant="outlined"
          type="number"
          label="Weight"
          slotProps={{
            htmlInput: { min: 0 },
          }}
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          sx={{ minWidth: 75, maxWidth: 100 }}
        />

        <TextField
          size="small"
          select
          label="Unit"
          value={weightUnit}
          onChange={(event) => setWeightUnit(event.target.value)}
          sx={{ minWidth: 70, maxWidth: 150 }}
        >
          {units.weightUnits.map((unit) => (
            <MenuItem key={`weightUnit-${unit.id}`} value={unit.id}>
              {unit.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </ListItem>
  );
};
