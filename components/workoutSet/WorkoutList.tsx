"use client";

import { AddExerciseRow } from "@/components/routines/AddExerciseRow";
import { RestTimer } from "@/components/sessions/RestTimer";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import {
  ListView,
  type RoutineDayId,
  type SetGroupWithRelations,
  type Units,
  type WorkoutSessionId,
} from "@/lib/convex-types";
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
import { useMutation } from "convex/react";
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
  sessionOrDayId: RoutineDayId | WorkoutSessionId;
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

  const reorderSetGroups = useMutation(api.mutations.setGroups.reorder);

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
    const dragId = event.active.id as string;
    const overId = event.over?.id as string;
    if (!overId || dragId === overId || !optimisticSetGroups.length) {
      return;
    }
    const oldIndex = optimisticSetGroups.findIndex((set) => set._id === dragId);
    const newIndex = optimisticSetGroups.findIndex((set) => set._id === overId);
    const newSetGroups = arrayMove(optimisticSetGroups, oldIndex, newIndex);
    startTransition(async () => {
      optimisticUpdateSetGroups(newSetGroups);
      await reorderSetGroups({
        sessionOrDayId,
        isSession: view !== ListView.EditTemplate,
        setGroupIds: newSetGroups.map((setGroup) => setGroup._id),
      });
    });
  };

  return (
    <>
      <Container maxWidth="lg">
        <AddExerciseRow
          sessionOrDayId={sessionOrDayId}
          isSession={view !== ListView.EditTemplate}
        />

        <div className="my-4 flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="reorder-switch"
              checked={isReorderActive}
              onCheckedChange={setReorderActive}
            />
            <Label htmlFor="reorder-switch">Reorder Sets</Label>
          </div>

          {view === ListView.CurrentSession && (
            <RestTimer
              open={isTimerOpen}
              setOpen={setTimerOpen}
              totalSeconds={totalSeconds}
              setTotalSeconds={setTotalSeconds}
              timer={timer}
            />
          )}
        </div>
      </Container>

      <Separator className="my-4" />

      <div className="space-y-2">
        <DndContext id="set-groups" onDragEnd={handleSort} sensors={sensors}>
          <SortableContext
            items={optimisticSetGroups.map((sg) => sg._id)}
            strategy={verticalListSortingStrategy}
          >
            {optimisticSetGroups.map((setGroup) => {
              return (
                <WorkoutSetGroup
                  view={view}
                  key={`set-${setGroup._id}`}
                  isReorderActive={isReorderActive}
                  setGroup={setGroup}
                  units={units}
                  startRestTimer={startRestTimer}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
};
