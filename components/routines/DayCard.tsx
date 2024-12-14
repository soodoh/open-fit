"use client";
import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
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
import { WorkoutSet } from "./WorkoutSet";
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
import { getDay, getSet, getSets } from "@/lib/urls";
import { EditDayModal } from "./EditDayModal";
import { useSWRConfig } from "swr";

export const DayCard = ({ dayId }: { dayId: number }) => {
  const authFetcher = useAuthFetcher();
  const { data: day } = useAuthedSWR<Day>(getDay(dayId));
  const { mutate } = useSWRConfig();
  const { data: workoutSets } = useAuthedSWR<PaginatedResponse<WorkoutSetType>>(
    getSets(dayId),
  );

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
      !workoutSets?.results
    ) {
      return;
    }
    const oldIndex = workoutSets.results.findIndex((set) => set.id === dragId);
    const newIndex = workoutSets.results.findIndex((set) => set.id === overId);
    const newSets = arrayMove(workoutSets.results, oldIndex, newIndex);

    const setPromises = Promise.all(
      newSets.reduce((acc, set, index) => {
        if (set.order !== index) {
          const setPromise = authFetcher(getSet(set.id), {
            method: "PATCH",
            body: JSON.stringify({ order: index }),
          });
          acc.push(setPromise);
        }
        return acc;
      }, [] as Promise<unknown>[]),
    );

    mutate(getSets(dayId), setPromises, {
      populateCache: false,
      optimisticData: {
        ...workoutSets,
        results: newSets,
      },
      revalidate: false,
      rollbackOnError: true,
    });
    setSortingState(true);
  };

  if (!day || !workoutSets?.results) {
    return null;
  }
  return (
    <>
      <EditDayModal
        open={edit}
        onClose={() => setEdit(false)}
        dayId={dayId}
        workoutId={day.training}
      />

      <Card sx={{ pb: 2 }}>
        <CardHeader
          title={
            <>
              <Typography variant="h5" gutterBottom>
                {day.description}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {day.day?.map((weekday) => (
                  <Chip
                    key={`day-${dayId}-weekday-${weekday}`}
                    label={moment().set("weekday", weekday).format("dddd")}
                  />
                ))}
              </Box>
            </>
          }
          action={<EditDayMenu dayId={dayId} />}
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
            <SortableContext
              items={workoutSets.results}
              strategy={verticalListSortingStrategy}
            >
              {workoutSets?.results?.map((set) => {
                return (
                  <WorkoutSet
                    key={`set-${set.id}`}
                    setId={set.id}
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
