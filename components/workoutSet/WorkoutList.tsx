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
import { List } from "@mui/material";
import { useOptimistic, useTransition } from "react";
import { WorkoutSetGroup } from "./WorkoutSetGroup";
import { Units } from "@/actions/getUnits";

export const WorkoutList = ({
  active = false,
  reorder,
  setGroups,
  units,
}: {
  active?: boolean;
  reorder: boolean;
  setGroups: SetGroupWithRelations[];
  units: Units;
}) => {
  const [, startTransition] = useTransition();
  const [optimisticSetGroups, optimisticUpdateSetGroups] = useOptimistic<
    SetGroupWithRelations[],
    SetGroupWithRelations[]
  >(setGroups, (_, newSetGroups) => newSetGroups);

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
    <List dense disablePadding>
      <DndContext id="set-groups" onDragEnd={handleSort} sensors={sensors}>
        <SortableContext
          items={optimisticSetGroups}
          strategy={verticalListSortingStrategy}
        >
          {optimisticSetGroups.map((setGroup) => {
            return (
              <WorkoutSetGroup
                active={active}
                key={`set-${setGroup.id}`}
                isReorderActive={reorder}
                setGroup={setGroup}
                units={units}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </List>
  );
};
