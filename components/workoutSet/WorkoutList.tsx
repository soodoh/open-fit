import { Units } from "@/actions/getUnits";
import { reorderSetGroups } from "@/actions/reorderSetGroups";
import { AddExerciseRow } from "@/components/routines/AddExerciseRow";
import { RestTimer } from "@/components/sessions/RestTimer";
import { ListView } from "@/types/constants";
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
  Box,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  List,
  Switch,
} from "@mui/material";
import dayjs from "dayjs";
import { useOptimistic, useState, useTransition } from "react";
import { useTimer } from "react-timer-hook";
import { WorkoutSetGroup } from "./WorkoutSetGroup";

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
  const [isTimerOpen, setTimerOpen] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState<number>(90);
  const expiryTimestamp = dayjs().add(totalSeconds, "seconds").toDate();
  const timer = useTimer({
    expiryTimestamp,
    autoStart: false,
  });

  const startRestTimer = (seconds: number) => {
    setTotalSeconds(seconds);
    timer.restart(dayjs().add(seconds, "seconds").toDate(), true);
    setTimerOpen(true);
  };

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

          {view === ListView.CurrentSession && (
            <RestTimer
              open={isTimerOpen}
              setOpen={setTimerOpen}
              totalSeconds={totalSeconds}
              setTotalSeconds={setTotalSeconds}
              timer={timer}
            />
          )}
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
                  startRestTimer={startRestTimer}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </List>
    </>
  );
};
