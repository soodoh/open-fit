import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimeField } from "@/components/ui/date-time-field";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { RepUnitMenu } from "./RepUnitMenu";
import { WeightUnitMenu } from "./WeightUnitMenu";
import type { Units } from "@/actions/getUnits";
import type { RepetitionUnit, WeightUnit } from "@/prisma/generated/client";
import type { SetGroupWithRelations } from "@/types/workoutSet";

export const BulkEditSetModal = ({
  open,
  onClose,
  setGroup,
  units,
}: {
  open: boolean;
  onClose: () => void;
  units: Units;
  setGroup: SetGroupWithRelations;
}) => {
  const [reps, setReps] = useState<string>("");
  const [restTime, setRestTime] = useState<Dayjs>(dayjs().minute(0).second(0));
  const [repUnit, setRepUnit] = useState<RepetitionUnit>(
    setGroup.sets[0].repetitionUnit,
  );
  const [weight, setWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    setGroup.sets[0].weightUnit,
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Update Sets</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Input
              type="text"
              value={reps}
              placeholder={`${setGroup.sets[0].reps}`}
              onChange={(event) => setReps(event.target.value)}
              className="pr-12"
            />
            <Label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
              {repUnit.name}
            </Label>
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <RepUnitMenu
                id={`bulk-rep-${setGroup.id}`}
                units={units}
                onChange={(repUnit) => setRepUnit(repUnit)}
              />
            </div>
          </div>

          <div className="relative">
            <Input
              type="text"
              value={weight}
              placeholder={`${setGroup.sets[0].weight}`}
              onChange={(event) => setWeight(event.target.value)}
              className="pr-12"
            />
            <Label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
              {weightUnit.name}
            </Label>
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <WeightUnitMenu
                id={`bulk-weight-${setGroup.id}`}
                units={units}
                onChange={(weightUnit) => setWeightUnit(weightUnit)}
              />
            </div>
          </div>

          <DateTimeField
            label="Rest Timer"
            value={restTime?.toDate() || null}
            onChange={(newTime) => {
              if (newTime) {
                setRestTime(dayjs(newTime));
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={async () => {
              const totalSeconds =
                (restTime?.get("minutes") ?? 0) * 60 +
                (restTime?.get("seconds") ?? 0);
              await fetch(`/api/setgroup/${setGroup.id}/bulkedit`, {
                method: "POST",
                body: JSON.stringify({
                  // If empty string, leave unchanged (undefined)
                  reps: reps ? parseInt(reps, 10) : undefined,
                  weight: weight ? parseInt(weight, 10) : undefined,
                  repetitionUnitId: repUnit.id,
                  weightUnitId: weightUnit.id,
                  restTime: totalSeconds,
                }),
              });
              onClose();
            }}
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
