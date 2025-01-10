import { Units } from "@/actions/getUnits";
import type { SetWithUnits } from "@/types/routineDay";
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
import { type FormEvent, useState } from "react";

export const WorkoutSetRow = ({
  set,
  units: {
    defaultRepetitionUnit,
    repetitionUnits,
    defaultWeightUnit,
    weightUnits,
  },
}: {
  set: SetWithUnits;
  units: Units;
}) => {
  const [reps, setReps] = useState<string>("0");
  const [repUnit, setRepUnit] = useState<string>(defaultRepetitionUnit.name);
  const [weight, setWeight] = useState<string>("0");
  const [weightUnit, setWeightUnit] = useState<string>(defaultWeightUnit.name);
  const [edit, setEdit] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: set.id });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEdit(false);
  };

  const handleDelete = async () => {};

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
          <IconButton onClick={handleDelete}>
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
      onSubmit={handleSubmit}
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
        {
          <TextField
            size="small"
            select
            label="Type"
            value={repUnit}
            onChange={(event) => setRepUnit(event.target.value)}
            sx={{ minWidth: 100, maxWidth: 150 }}
          >
            {repetitionUnits.map((repUnit) => (
              <MenuItem key={`repUnit-${repUnit.id}`} value={repUnit.id}>
                {repUnit.name}
              </MenuItem>
            ))}
          </TextField>
        }
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
        {
          <TextField
            size="small"
            select
            label="Unit"
            value={weightUnit}
            onChange={(event) => setWeightUnit(event.target.value)}
            sx={{ minWidth: 70, maxWidth: 150 }}
          >
            {weightUnits.map((weightUnit) => (
              <MenuItem
                key={`weightUnit-${weightUnit.id}`}
                value={weightUnit.id}
              >
                {weightUnit.name}
              </MenuItem>
            ))}
          </TextField>
        }
      </Box>
    </ListItem>
  );
};
