"use client";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControlLabel,
  FormGroup,
  List,
  Switch,
  Typography,
} from "@mui/material";
import { EditDayMenu } from "./EditDayMenu";
import moment from "moment";
import {
  DndContext,
  DragEndEvent,
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
import { AddExerciseRow } from "./AddExerciseRow";
import { useOptimistic, useState, useTransition } from "react";
import { reorderSetGroups } from "@/actions/reorderSetGroups";
import type { RoutineDayWithSets } from "@/types/routineDay";
import type { SetGroupWithSets } from "@/types/workoutSet";
import type { Units } from "@/actions/getUnits";
import { WorkoutSetGroup } from "../workoutSet/WorkoutSetGroup";
import { Settings } from "@mui/icons-material";

export const DayCard = ({
  routineDay,
  units,
}: {
  routineDay: RoutineDayWithSets;
  units: Units;
}) => {
  const [isReorderActive, setReorderActive] = useState(false);
  const [, startTransition] = useTransition();
  const [setGroups, optimisticUpdateSetGroups] = useOptimistic<
    SetGroupWithSets[],
    SetGroupWithSets[]
  >(routineDay.setGroups, (_, newSetGroups) => newSetGroups);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleSort = (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (!Number.isInteger(overId) || dragId === overId || !setGroups.length) {
      return;
    }
    const oldIndex = setGroups.findIndex((set) => set.id === dragId);
    const newIndex = setGroups.findIndex((set) => set.id === overId);
    const newSetGroups = arrayMove(setGroups, oldIndex, newIndex);
    startTransition(async () => {
      optimisticUpdateSetGroups(newSetGroups);
      await reorderSetGroups(newSetGroups);
    });
  };

  return (
    <>
      <Card sx={{ pb: 2 }}>
        <CardHeader
          title={
            <>
              <Typography variant="h5" gutterBottom>
                {routineDay.description}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {routineDay.weekdays.map((weekday) => (
                  <Chip
                    key={`day-${routineDay.id}-weekday-${weekday}`}
                    label={moment(weekday, "dddd").format("dddd")}
                  />
                ))}
              </Box>
            </>
          }
          action={<EditDayMenu routineDay={routineDay} icon={<Settings />} />}
        />

        <CardContent>
          <AddExerciseRow dayId={routineDay.id} />
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
        </CardContent>

        <List dense disablePadding>
          <DndContext id="set-groups" onDragEnd={handleSort} sensors={sensors}>
            <SortableContext
              items={setGroups}
              strategy={verticalListSortingStrategy}
            >
              {setGroups.map((setGroup) => {
                return (
                  <WorkoutSetGroup
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
      </Card>
    </>
  );
};
