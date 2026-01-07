import { Units } from "@/actions/getUnits";
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
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
      await fetch("/api/setgroup/reorder", {
        method: "POST",
        body: JSON.stringify({
          setGroupIds: newSetGroups.map((setGroup) => setGroup.id),
        }),
      });
    });
  };

  return (
    <>
      <Container maxWidth="lg">
        <AddExerciseRow
          sessionOrDayId={sessionOrDayId}
          type={view === ListView.EditTemplate ? "routineDay" : "session"}
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
      </div>
    </>
  );
};
