"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import {
  ListView,
  type SetWithRelations,
  type Units,
} from "@/lib/convex-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "convex/react";
import { GripVertical, MoreVertical } from "lucide-react";
import { RepUnitMenu } from "./RepUnitMenu";
import { SetTypeMenu } from "./SetTypeMenu";
import { WeightUnitMenu } from "./WeightUnitMenu";
import { WorkoutTimer } from "./WorkoutTimer";

export const WorkoutSetRow = ({
  view,
  set,
  setNum,
  reorder,
  units,
  startRestTimer,
}: {
  view: ListView;
  set: SetWithRelations;
  setNum: number;
  reorder: boolean;
  units: Units;
  startRestTimer: (seconds: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: set._id });
  const isRowDisabled = set.completed && view === ListView.CurrentSession;

  const updateSet = useMutation(api.mutations.sets.update);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 p-3 border-b border-gray-100 min-h-[60px]"
    >
      {(reorder || view !== ListView.CurrentSession) && (
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

      {(!reorder || view !== ListView.CurrentSession) && (
        // TODO add delete & setRestTimer
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      )}

      <SetTypeMenu set={set} setNum={setNum} />

      <div className="flex gap-2 flex-1 my-1">
        <div className="relative flex-1">
          <Input
            key={`reps-${set._id}-${set.reps}`}
            type="text"
            disabled={isRowDisabled}
            defaultValue={set.reps}
            className="pr-12"
            onBlur={async (event) => {
              updateSet({
                id: set._id,
                reps: parseInt(event.target.value, 10) || 0,
              });
            }}
          />
          <Label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
            {set.repetitionUnit.name}
          </Label>
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <RepUnitMenu
              id={set._id}
              units={units}
              onChange={(repUnit) => {
                updateSet({
                  id: set._id,
                  repetitionUnitId: repUnit._id,
                });
              }}
            />
          </div>
        </div>

        <div className="relative flex-1">
          <Input
            key={`weight-${set._id}-${set.weight}`}
            type="text"
            disabled={isRowDisabled}
            defaultValue={set.weight}
            className="pr-12"
            onBlur={async (event) => {
              updateSet({
                id: set._id,
                weight: parseInt(event.target.value, 10) || 0,
              });
            }}
          />
          <Label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
            {set.weightUnit.name}
          </Label>
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <WeightUnitMenu
              id={set._id}
              units={units}
              onChange={(weightUnit) => {
                updateSet({
                  id: set._id,
                  weightUnitId: weightUnit._id,
                });
              }}
            />
          </div>
        </div>

        {view === ListView.CurrentSession &&
          (set.repetitionUnit.name === "Seconds" && !set.completed ? (
            <WorkoutTimer
              set={set}
              onComplete={async () => {
                updateSet({
                  id: set._id,
                  completed: true,
                });
                if (set.restTime) {
                  startRestTimer(set.restTime);
                }
              }}
            />
          ) : (
            <div className="flex items-center">
              <Checkbox
                aria-label="Mark as Completed"
                checked={set.completed}
                onCheckedChange={(checked: boolean) => {
                  updateSet({
                    id: set._id,
                    completed: checked,
                  });
                  if (set.restTime && checked) {
                    startRestTimer(set.restTime);
                  }
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
