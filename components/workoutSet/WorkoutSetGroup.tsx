"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { api } from "@/convex/_generated/api";
import {
  ListView,
  type SetGroupWithRelations,
  SetType,
  type SetWithNumber,
  type SetWithRelations,
  type Units,
} from "@/lib/convex-types";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "convex/react";
import {
  AlertCircle,
  GripVertical,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { EditSetGroupMenu } from "./EditSetGroupMenu";
import { WorkoutSetRow } from "./WorkoutSetRow";

export const WorkoutSetGroup = ({
  view,
  setGroup,
  isReorderActive,
  units,
  startRestTimer,
}: {
  view: ListView;
  setGroup: SetGroupWithRelations;
  isReorderActive: boolean;
  units: Units;
  startRestTimer: (seconds: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setGroup._id });
  const [, startTransition] = useTransition();
  const [sets, optimisticUpdateSets] = useOptimistic<
    SetWithRelations[],
    SetWithRelations[]
  >(setGroup.sets, (_, newSets) => newSets);
  const [expanded, setExpanded] = useState(
    view === ListView.CurrentSession && sets.some((set) => !set.completed),
  );
  const [canReorderSets, setReorderSets] = useState(false);

  const createSet = useMutation(api.mutations.sets.create);
  const reorderSets = useMutation(api.mutations.sets.reorder);

  useEffect(() => {
    if (sets.every((set) => set.completed)) {
      setExpanded(false);
    }
  }, [sets]);

  const exercise = sets[0]?.exercise;
  const setsWithNumber = useMemo(() => {
    let setNum = 1;
    return sets.reduce((acc, set) => {
      acc.push({ set, setNum });
      if (set.type === SetType.NORMAL) {
        setNum += 1;
      }
      return acc;
    }, [] as SetWithNumber[]);
  }, [sets]);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleAdd = async () => {
    await createSet({
      setGroupId: setGroup._id,
      exerciseId: exercise._id,
    });
  };

  const handleSort = (event: DragEndEvent) => {
    const dragId = event.active.id as string;
    const overId = event.over?.id as string;
    if (!overId || dragId === overId) {
      return;
    }

    const oldIndex = sets.findIndex((set) => set._id === dragId);
    const newIndex = sets.findIndex((set) => set._id === overId);
    const newSets = arrayMove(sets, oldIndex, newIndex);
    startTransition(async () => {
      optimisticUpdateSets(newSets);
      await reorderSets({ setIds: newSets.map(({ _id }) => _id) });
    });
  };

  return (
    <Collapsible open={!isReorderActive && expanded} className="w-full">
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50"
      >
        <CollapsibleTrigger
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          {isReorderActive && (
            <Button
              variant="ghost"
              size="icon"
              className="touch-manipulation"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          )}

          <Avatar className="h-8 w-8">
            {exercise ? (
              <>
                <AvatarImage
                  src={`/exercises/${exercise.images[0]}`}
                  alt={`${exercise.name} set item`}
                />
                <AvatarFallback>
                  <ImageIcon className="h-4 w-4" />
                </AvatarFallback>
              </>
            ) : (
              <AvatarFallback>
                <AlertCircle className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1">
            <div
              className={`font-medium ${
                setGroup.sets.every((set) => set.completed)
                  ? "line-through text-gray-500"
                  : "text-gray-900"
              }`}
            >
              {exercise?.name ?? "Unknown exercise"}
            </div>
            <div className="text-sm text-gray-500">{sets.length} sets</div>
          </div>
        </CollapsibleTrigger>

        {!isReorderActive && (
          <EditSetGroupMenu
            view={view}
            setGroup={setGroup}
            reorder={canReorderSets}
            onReorder={() => setReorderSets(!canReorderSets)}
            units={units}
          />
        )}
      </div>

      <CollapsibleContent>
        <div className="pl-4">
          {setGroup.comment && (
            <div className="pl-8 py-2 text-sm text-gray-600">
              {setGroup.comment}
            </div>
          )}

          <DndContext id="sets" onDragEnd={handleSort} sensors={sensors}>
            <SortableContext
              items={sets.map((s) => s._id)}
              strategy={verticalListSortingStrategy}
            >
              {setsWithNumber.map(({ set, setNum }) => {
                return (
                  <WorkoutSetRow
                    key={`set-row-${set._id}`}
                    view={view}
                    set={set}
                    setNum={setNum}
                    units={units}
                    reorder={canReorderSets}
                    startRestTimer={startRestTimer}
                  />
                );
              })}
            </SortableContext>
          </DndContext>

          <div className="flex gap-2 p-3">
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New set
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
