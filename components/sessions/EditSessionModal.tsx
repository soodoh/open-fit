import { SessionWithRelations } from "@/types/workoutSession";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
import { SelectTemplate } from "./SelectTemplate";
import type { RoutineDayWithRoutine } from "@/types/routine";

export const EditSessionModal = ({
  session,
  open,
  onClose,
}: {
  open: boolean;
  session?: SessionWithRelations;
  onClose: () => void;
}) => {
  const [name, setName] = useState<string>(session?.name ?? "");
  const [notes, setNotes] = useState<string>(session?.notes ?? "");
  const [impression, setImpression] = useState<number | null>(
    session?.impression ?? null,
  );
  const [startTime, setStartTime] = useState<Dayjs | null>(
    session?.startTime ? dayjs(session.startTime) : dayjs(),
  );
  const [endTime, setEndTime] = useState<Dayjs | null>(
    session?.endTime ? dayjs(session.endTime) : null,
  );
  const [workoutTemplate, setWorkoutTemplate] =
    useState<RoutineDayWithRoutine | null>(session?.template ?? null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Must be null or valid date
    const isStartValid = startTime === null || startTime.isValid();
    const isEndValid = endTime === null || endTime.isValid();
    // Prevent negative durations (if both are valid dates)
    const isDurationValid =
      !startTime || !endTime || startTime.isBefore(endTime);
    if (!isStartValid || !isEndValid || !isDurationValid) {
      return;
    }
    const sessionData = {
      templateId: workoutTemplate?.id,
      name,
      startTime: startTime?.toDate(),
      endTime: endTime?.toDate(),
      notes,
      impression,
    };
    await fetch(session ? `/api/session/${session.id}` : "/api/session", {
      method: "POST",
      body: JSON.stringify(sessionData),
    });
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
            value={session?.template ?? null}
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
