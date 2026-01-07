import { type Units } from "@/actions/getUnits";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SetType } from "@/prisma/generated/client";
import { ListView } from "@/types/constants";
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
import type {
  SetGroupWithRelations,
  SetWithNumber,
  SetWithRelations,
} from "@/types/workoutSet";

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
    useSortable({ id: setGroup.id });
  const [, startTransition] = useTransition();
  const [sets, optimisticUpdateSets] = useOptimistic<
    SetWithRelations[],
    SetWithRelations[]
  >(setGroup.sets, (_, newSets) => newSets);
  const [expanded, setExpanded] = useState(
    view === ListView.CurrentSession && sets.some((set) => !set.completed),
  );
  const [canReorderSets, setReorderSets] = useState(false);

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
    await fetch("/api/set", {
      method: "POST",
      body: JSON.stringify({
        setGroupId: setGroup.id,
        exerciseId: exercise.id,
      }),
    });
  };

  const handleSort = (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (!Number.isInteger(overId) || dragId === overId) {
      return;
    }

    const oldIndex = sets.findIndex((set) => set.id === dragId);
    const newIndex = sets.findIndex((set) => set.id === overId);
    const newSets = arrayMove(sets, oldIndex, newIndex);
    startTransition(async () => {
      optimisticUpdateSets(newSets);
      await fetch("/api/set/reorder", {
        method: "POST",
        body: JSON.stringify({ setIds: newSets.map(({ id }) => id) }),
      });
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
                items={sets}
                strategy={verticalListSortingStrategy}
              >
                {setsWithNumber.map(({ set, setNum }) => {
                  return (
                    <WorkoutSetRow
                      key={`set-row-${set.id}`}
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
