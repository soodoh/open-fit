"use client";

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
import { useState } from "react";
import type { Routine } from "@/lib/convex-types";

export const EditRoutineModal = ({
  open,
  onClose,
  routine,
}: {
  routine?: Routine;
  open: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState(routine?.name ?? "");
  const [description, setDescription] = useState(routine?.description ?? "");
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {},
  );

  const createRoutine = useMutation(api.mutations.routines.create);
  const updateRoutine = useMutation(api.mutations.routines.update);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPending(true);
    setErrors({});

    try {
      if (routine) {
        await updateRoutine({
          id: routine._id,
          name,
          description: description || undefined,
        });
      } else {
        await createRoutine({
          name,
          description: description || undefined,
        });
      }
      onClose();
    } catch (error) {
      setErrors({ name: "Failed to save routine" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {routine ? "Edit Routine" : "New Routine"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="routine-name">Name</Label>
              <Input
                id="routine-name"
                name="name"
                placeholder="Routine name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="routine-description">Description</Label>
              <textarea
                id="routine-description"
                name="description"
                placeholder="Routine description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
