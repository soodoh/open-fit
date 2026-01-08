"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import dayjs from "dayjs";
import { useState } from "react";
import type { RoutineDay, RoutineId } from "@/lib/convex-types";

export const EditDayModal = ({
  open,
  onClose,
  routineId,
  routineDay,
}: {
  open: boolean;
  onClose: () => void;
  routineId: RoutineId;
  routineDay?: RoutineDay;
}) => {
  const [selectedWeekdays, setWeekdays] = useState<number[]>(
    routineDay?.weekdays ?? [],
  );
  const [description, setDescription] = useState(routineDay?.description ?? "");

  const createDay = useMutation(api.mutations.routineDays.create);
  const updateDay = useMutation(api.mutations.routineDays.update);

  const toggleWeekday = (weekday: number) => {
    const newWeekdays = selectedWeekdays.includes(weekday)
      ? selectedWeekdays.filter((d) => d !== weekday)
      : [...selectedWeekdays, weekday].sort((a, b) => a - b);
    setWeekdays(newWeekdays);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (routineDay) {
      await updateDay({
        id: routineDay._id,
        description,
        weekdays: selectedWeekdays,
      });
    } else {
      await createDay({
        routineId,
        description,
        weekdays: selectedWeekdays,
      });
    }

    onClose();
    setWeekdays([]);
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {routineDay ? "Edit Workout Day" : "New Workout Day"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workoutDay-name">Description</Label>
              <Input
                id="workoutDay-name"
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Weekdays</Label>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((weekday) => (
                  <Button
                    key={`${routineDay?._id || "new"}-${weekday}`}
                    type="button"
                    variant={
                      selectedWeekdays.includes(weekday) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleWeekday(weekday)}
                    className="p-2 text-xs"
                  >
                    {dayjs().day(weekday).format("ddd")}
                  </Button>
                ))}
              </div>
              {selectedWeekdays.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedWeekdays.map((weekday) => (
                    <Badge
                      key={`${routineDay?._id || "new"}-selected-${weekday}`}
                      variant="secondary"
                    >
                      {dayjs().day(weekday).format("dddd")}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
