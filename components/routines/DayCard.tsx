"use client";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  Typography,
} from "@mui/material";
import { WorkoutSetGroup } from "./WorkoutSetGroup";
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
import { useState } from "react";
import { EditDayModal } from "./EditDayModal";
import { reorderSetGroups } from "@/actions/reorderSetGroups";
import { revalidatePath } from "next/cache";
import type { RoutineDayWithSets } from "@/types/routineDay";
import type { Units } from "@/actions/getUnits";

export const DayCard = ({
  routineDay,
}: {
  routineDay: RoutineDayWithSets;
  units: Units;
}) => {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [isSortingActive, setSortingState] = useState(true);
  const [edit, setEdit] = useState(false);

  const handleSort = async (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (
      !Number.isInteger(overId) ||
      dragId === overId ||
      !routineDay.setGroups.length
    ) {
      return;
    }
    const oldIndex = routineDay.setGroups.findIndex((set) => set.id === dragId);
    const newIndex = routineDay.setGroups.findIndex((set) => set.id === overId);
    const newSets = arrayMove(routineDay.setGroups, oldIndex, newIndex);
    await reorderSetGroups(newSets);
    revalidatePath(`/day/${routineDay.id}`);
    setSortingState(true);
  };

  return (
    <>
      <EditDayModal
        open={edit}
        onClose={() => setEdit(false)}
        routineDay={routineDay}
        routineId={routineDay.routineId}
      />

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
          action={<EditDayMenu routineDay={routineDay} />}
        />

        <CardContent>
          <AddExerciseRow dayId={routineDay.id} />
        </CardContent>

        <List dense disablePadding>
          <DndContext
            onDragEnd={handleSort}
            onDragStart={() => setSortingState(false)}
            onDragCancel={() => setSortingState(true)}
            onDragAbort={() => setSortingState(true)}
            sensors={sensors}
          >
            <SortableContext
              items={routineDay.setGroups}
              strategy={verticalListSortingStrategy}
            >
              {routineDay.setGroups.map((setGroup) => {
                return (
                  <WorkoutSetGroup
                    key={`set-${setGroup.id}`}
                    setGroup={setGroup}
                    isSortingActive={isSortingActive}
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
