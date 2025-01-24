import { deleteSet } from "@/actions/deleteSet";
import { editSet } from "@/actions/editSet";
import type { Units } from "@/actions/getUnits";
import type { SetWithUnits } from "@/types/workoutSet";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Delete, DragHandle } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemIcon,
  TextField,
} from "@mui/material";
import { SetTypeMenu } from "./SetTypeMenu";
import { RepUnitMenu } from "./RepUnitMenu";
import { WeightUnitMenu } from "./WeightUnitMenu";

export const WorkoutSetRow = ({
  set,
  setNum,
  units,
}: {
  set: SetWithUnits;
  setNum: number;
  units: Units;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: set.id });

  return (
    <ListItem
      dense
      disablePadding
      ref={setNodeRef}
      sx={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <ListItemIcon>
        <IconButton
          sx={{ mx: 2, touchAction: "manipulation" }}
          {...attributes}
          {...listeners}
        >
          <DragHandle />
        </IconButton>
      </ListItemIcon>

      <SetTypeMenu set={set} setNum={setNum} />

      <Box sx={{ display: "flex", gap: 2, my: 1 }}>
        <TextField
          size="small"
          variant="outlined"
          type="string"
          label={set.repetitionUnit.name}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <RepUnitMenu set={set} units={units} />
                </InputAdornment>
              ),
            },
          }}
          defaultValue={set.reps}
          onBlur={async (event) => {
            await editSet({
              id: set.id,
              reps: parseInt(event.target.value, 10) || 0,
            });
          }}
        />

        <TextField
          size="small"
          variant="outlined"
          type="string"
          label={set.weightUnit.name}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <WeightUnitMenu set={set} units={units} />
                </InputAdornment>
              ),
            },
          }}
          defaultValue={set.weight}
          onBlur={async (event) => {
            await editSet({
              id: set.id,
              weight: parseInt(event.target.value, 10) || 0,
            });
          }}
        />
      </Box>

      <ListItemIcon>
        <IconButton onClick={() => deleteSet(set.id)}>
          <Delete />
        </IconButton>
      </ListItemIcon>
    </ListItem>
  );
};
