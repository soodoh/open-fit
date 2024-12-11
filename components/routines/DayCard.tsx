"use client";
import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import useSWR from "swr";
import type { PaginatedResponse } from "@/types/response";
import type { WorkoutSetType } from "@/types/privateApi/set";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  Typography,
} from "@mui/material";
import { WorkoutSet as WorkoutSet } from "./WorkoutSet";
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

export const DayCard = ({
  dayId,
  workoutId,
}: {
  dayId: number;
  workoutId: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: day } = useSWR<Day>(`/day/${dayId}`, authFetcher);
  const { data: workoutSets, mutate: mutateSets } = useSWR<
    PaginatedResponse<WorkoutSetType>
  >(`/set?exerciseday=${dayId}`, authFetcher);
  const sets = workoutSets?.results ?? [];

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [isSortingActive, setSortingState] = useState(true);

  const handleSort = async (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (!Number.isInteger(overId) || dragId === overId) {
      return;
    }
    const oldIndex = sets.findIndex((set) => set.id === dragId);
    const newIndex = sets.findIndex((set) => set.id === overId);
    const newSets = arrayMove(sets, oldIndex, newIndex);

    const patchUpdates = newSets.reduce((acc, set, index) => {
      if (set.order !== index) {
        acc.push(
          authFetcher(`/set/${set.id}`, {
            method: "PATCH",
            body: JSON.stringify({ order: index }),
          }),
        );
      }
      return acc;
    }, [] as Promise<unknown>[]);
    await Promise.all(patchUpdates);
    mutateSets({ ...workoutSets, results: newSets });
    setSortingState(true);
  };

  if (!day) {
    return null;
  }
  return (
    <Card>
      <CardHeader
        title={
          <>
            <Typography variant="h5" gutterBottom>
              {day.description}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {day.day.map((weekday) => (
                <Chip
                  key={`day-${dayId}-weekday-${weekday}`}
                  label={moment().set("weekday", weekday).format("dddd")}
                />
              ))}
            </Box>
          </>
        }
        action={<EditDayMenu workoutId={workoutId} dayId={dayId} />}
      />

      <CardContent>
        <AddExerciseRow dayId={dayId} />
      </CardContent>

      <List dense disablePadding>
        <DndContext
          onDragEnd={handleSort}
          onDragStart={() => setSortingState(false)}
          onDragCancel={() => setSortingState(true)}
          onDragAbort={() => setSortingState(true)}
          sensors={sensors}
        >
          <SortableContext items={sets} strategy={verticalListSortingStrategy}>
            {sets.map((set) => {
              return (
                <WorkoutSet
                  key={`set-${set.id}`}
                  dayId={dayId}
                  setId={set.id}
                  isSortingActive={isSortingActive}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </List>
    </Card>
  );
};
