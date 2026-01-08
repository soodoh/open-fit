"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
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
import { useState } from "react";
import { SelectTemplate } from "./SelectTemplate";
import type {
  RoutineDayWithRoutine,
  WorkoutSessionWithData,
} from "@/lib/convex-types";

export const EditSessionModal = ({
  session,
  open,
  onClose,
}: {
  open: boolean;
  session?: WorkoutSessionWithData;
  onClose: () => void;
}) => {
  const [name, setName] = useState<string>(session?.name ?? "");
  const [notes, setNotes] = useState<string>(session?.notes ?? "");
  const [impression, setImpression] = useState<number | null>(
    session?.impression ?? null,
  );
  const [startTime, setStartTime] = useState<Date | null>(
    session?.startTime ? new Date(session.startTime) : new Date(),
  );
  const [endTime, setEndTime] = useState<Date | null>(
    session?.endTime ? new Date(session.endTime) : null,
  );
  const [workoutTemplate, setWorkoutTemplate] =
    useState<RoutineDayWithRoutine | null>(null);

  const createSession = useMutation(api.mutations.sessions.create);
  const updateSession = useMutation(api.mutations.sessions.update);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Must be null or valid date
    const isStartValid = startTime === null || !isNaN(startTime.getTime());
    const isEndValid = endTime === null || !isNaN(endTime.getTime());
    // Prevent negative durations (if both are valid dates)
    const isDurationValid =
      !startTime || !endTime || startTime.getTime() < endTime.getTime();
    if (!isStartValid || !isEndValid || !isDurationValid) {
      return;
    }

    if (session) {
      await updateSession({
        id: session._id,
        name,
        startTime: startTime?.getTime(),
        endTime: endTime?.getTime() ?? undefined,
        notes,
        impression: impression ?? undefined,
      });
    } else {
      await createSession({
        templateId: workoutTemplate?._id,
        name,
        startTime: startTime?.getTime() ?? Date.now(),
        endTime: endTime?.getTime(),
        notes,
        impression: impression ?? undefined,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {session ? "Edit Workout Session" : "Create Workout Session"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectTemplate
            disabled={!!session}
            label={session ? "Created with template" : "Start with template"}
            value={null}
            onChange={(selectedTemplate) => {
              setWorkoutTemplate(selectedTemplate);
              if (selectedTemplate?.description) {
                setName(selectedTemplate.description);
              }
            }}
          />

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={(newTime) => {
              setStartTime(newTime);
            }}
          />

          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={(newTime) => {
              setEndTime(newTime);
            }}
          />

          <div className="space-y-2">
            <Label>General Impression</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImpression(i + 1)}
                  className={`text-xl ${
                    i < (impression || 0)
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  } transition-colors`}
                >
                  ★
                </button>
              ))}
              {impression && (
                <button
                  type="button"
                  onClick={() => setImpression(null)}
                  className="ml-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
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
