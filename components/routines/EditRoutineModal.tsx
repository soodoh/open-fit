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
import { useActionState } from "react";
import type { Routine } from "@/prisma/generated/client";

type RoutineActionState = {
  data: {
    name: string;
    description?: string;
  };
  errors?: {
    name?: string[];
    description?: string[];
  };
};

export const EditRoutineModal = ({
  open,
  onClose,
  routine,
}: {
  routine?: Routine;
  open: boolean;
  onClose: () => void;
}) => {
  // TODO replace with React Query mutations
  const [state, action, isPending] = useActionState(
    async (_prevState: RoutineActionState, formData: FormData) => {
      const nextState = await fetch(
        routine ? `/api/routine/${routine.id}` : "/api/routine",
        {
          method: "POST",
          body: formData,
        },
      ).then((res) => res.json());
      if (!nextState.errors) {
        onClose();
      }
      return nextState;
    },
    {
      data: {
        name: routine?.name ?? "",
        description: routine?.description ?? "",
      },
    },
  );

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={action}>
          <DialogHeader>
            <DialogTitle>{routine ? "Edit Routine" : "New Routine"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="routine-name">Name</Label>
              <Input
                id="routine-name"
                name="name"
                placeholder="Routine name"
                required
                defaultValue={state.data.name}
                className={state.errors?.name ? "border-red-500" : ""}
              />
              {state.errors?.name && (
                <p className="text-sm text-red-600">{state.errors.name[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="routine-description">Description</Label>
              <textarea
                id="routine-description"
                name="description"
                placeholder="Routine description"
                rows={4}
                defaultValue={state.data.description}
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  state.errors?.description ? "border-red-500" : ""
                }`}
              />
              {state.errors?.description && (
                <p className="text-sm text-red-600">{state.errors.description[0]}</p>
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
