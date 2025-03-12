import { editSet } from "@/actions/editSet";
import type { Units } from "@/actions/getUnits";
import type { SetWithRelations } from "@/types/workoutSet";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle, MoreVert } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  InputAdornment,
  ListItem,
  TextField,
} from "@mui/material";
import { SetTypeMenu } from "./SetTypeMenu";
import { RepUnitMenu } from "./RepUnitMenu";
import { WeightUnitMenu } from "./WeightUnitMenu";
import { ListView } from "@/types/constants";
import { WorkoutTimer } from "./WorkoutTimer";

export const WorkoutSetRow = ({
  view,
  set,
  setNum,
  reorder,
  units,
  startRestTimer,
}: {
  view: ListView;
  set: SetWithRelations;
  setNum: number;
  reorder: boolean;
  units: Units;
  startRestTimer: (seconds: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: set.id });
  const isRowDisabled = set.completed && view === ListView.CurrentSession;

  return (
    <ListItem
      dense
      ref={setNodeRef}
      sx={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {(reorder || view !== ListView.CurrentSession) && (
        <IconButton
          sx={{ touchAction: "manipulation" }}
          {...attributes}
          {...listeners}
        >
          <DragHandle />
        </IconButton>
      )}

      {(!reorder || view !== ListView.CurrentSession) && (
        // TODO add delete & setRestTimer
        <IconButton>
          <MoreVert fontSize="small" />
        </IconButton>
      )}

      <SetTypeMenu set={set} setNum={setNum} />

      <Box sx={{ display: "flex", gap: 1, my: 1 }}>
        <TextField
          key={`reps-${set.id}-${set.reps}`}
          size="small"
          variant="outlined"
          type="string"
          label={set.repetitionUnit.name}
          disabled={isRowDisabled}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <RepUnitMenu
                    id={set.id}
                    units={units}
                    onChange={(repUnit) => {
                      editSet({ id: set.id, repetitionUnitId: repUnit.id });
                    }}
                  />
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
          key={`weight-${set.id}-${set.weight}`}
          size="small"
          variant="outlined"
          type="string"
          label={set.weightUnit.name}
          disabled={isRowDisabled}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <WeightUnitMenu
                    id={set.id}
                    units={units}
                    onChange={(weightUnit) => {
                      editSet({ id: set.id, weightUnitId: weightUnit.id });
                    }}
                  />
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
        {view === ListView.CurrentSession &&
          (set.repetitionUnit.name === "Seconds" && !set.completed ? (
            <WorkoutTimer
              set={set}
              onComplete={async () => {
                await editSet({ id: set.id, completed: true });
                if (set.restTime) {
                  startRestTimer(set.restTime);
                }
              }}
            />
          ) : (
            <Box>
              <Checkbox
                size="small"
                color="default"
                aria-label="Mark as Completed"
                checked={set.completed}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  editSet({ id: set.id, completed: event.target.checked });
                  if (set.restTime && event.target.checked) {
                    startRestTimer(set.restTime);
                  }
                }}
              />
            </Box>
          ))}
      </Box>
    </ListItem>
  );
};
