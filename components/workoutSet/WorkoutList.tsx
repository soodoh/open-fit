import { reorderSetGroups } from "@/actions/reorderSetGroups";
import { SetGroupWithRelations } from "@/types/workoutSet";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  List,
  Switch,
  Grid2 as Grid,
  Box,
} from "@mui/material";
import { useOptimistic, useState, useTransition } from "react";
import { WorkoutSetGroup } from "./WorkoutSetGroup";
import { Units } from "@/actions/getUnits";
import { ListView } from "@/types/constants";
import { AddExerciseRow } from "../routines/AddExerciseRow";
import { CurrentDuration } from "../sessions/CurrentDuration";
import { RestTimer } from "../sessions/RestTimer";

export const WorkoutList = ({
  view = ListView.EditTemplate,
  setGroups,
  units,
  sessionOrDayId,
}: {
  view: ListView;
  setGroups: SetGroupWithRelations[];
  units: Units;
  sessionOrDayId: number;
}) => {
  const [, startTransition] = useTransition();
  const [optimisticSetGroups, optimisticUpdateSetGroups] = useOptimistic<
    SetGroupWithRelations[],
    SetGroupWithRelations[]
  >(setGroups, (_, newSetGroups) => newSetGroups);
  const [isReorderActive, setReorderActive] = useState(false);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleSort = (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (
      !Number.isInteger(overId) ||
      dragId === overId ||
      !optimisticSetGroups.length
    ) {
      return;
    }
    const oldIndex = optimisticSetGroups.findIndex((set) => set.id === dragId);
    const newIndex = optimisticSetGroups.findIndex((set) => set.id === overId);
    const newSetGroups = arrayMove(optimisticSetGroups, oldIndex, newIndex);
    startTransition(async () => {
      optimisticUpdateSetGroups(newSetGroups);
      await reorderSetGroups(newSetGroups);
    });
  };

  return (
    <>
      <Container maxWidth="lg">
        <AddExerciseRow
          sessionOrDayId={sessionOrDayId}
          type={view === ListView.EditTemplate ? "routineDay" : "session"}
        />

        <Box sx={{ my: 2, display: "flex", alignItems: "center" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  value={isReorderActive}
                  onChange={(event) => setReorderActive(event.target.checked)}
                />
              }
              label="Reorder Sets"
            />
          </FormGroup>

          {view === ListView.CurrentSession && <RestTimer />}
        </Box>
      </Container>

      <Divider sx={{ my: 2 }} />

      <List dense disablePadding>
        <DndContext id="set-groups" onDragEnd={handleSort} sensors={sensors}>
          <SortableContext
            items={optimisticSetGroups}
            strategy={verticalListSortingStrategy}
          >
            {optimisticSetGroups.map((setGroup) => {
              return (
                <WorkoutSetGroup
                  view={view}
                  key={`set-${setGroup.id}`}
                  isReorderActive={isReorderActive}
                  setGroup={setGroup}
                  units={units}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </List>
    </>
  );
};
