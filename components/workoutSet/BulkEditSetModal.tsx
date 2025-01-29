import type { Units } from "@/actions/getUnits";
import type { SetGroupWithRelations } from "@/types/workoutSet";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";
import { bulkEditSets } from "@/actions/bulkEditSets";
import { useState } from "react";
import type { RepetitionUnit, WeightUnit } from "@prisma/client";
import { RepUnitMenu } from "./RepUnitMenu";
import { WeightUnitMenu } from "./WeightUnitMenu";

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
  const [repUnit, setRepUnit] = useState<RepetitionUnit>(
    setGroup.sets[0].repetitionUnit,
  );
  const [weight, setWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    setGroup.sets[0].weightUnit,
  );

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      onClose={onClose}
      aria-labelledby="update-set-title"
      aria-describedby="update-set-description"
    >
      <DialogTitle id="update-set-title">Bulk Update Sets</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            size="small"
            variant="outlined"
            type="string"
            label={repUnit.name}
            value={reps}
            placeholder={`${setGroup.sets[0].reps}`}
            onChange={(event) => setReps(event.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <RepUnitMenu
                      id={`bulk-rep-${setGroup.id}`}
                      units={units}
                      onChange={(repUnit) => setRepUnit(repUnit)}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            size="small"
            variant="outlined"
            type="string"
            label={weightUnit.name}
            value={weight}
            placeholder={`${setGroup.sets[0].weight}`}
            onChange={(event) => setWeight(event.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <WeightUnitMenu
                      id={`bulk-weight-${setGroup.id}`}
                      units={units}
                      onChange={(weightUnit) => setWeightUnit(weightUnit)}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={async () => {
            await bulkEditSets(setGroup.id, {
              // If empty string, leave unchanged (undefined)
              reps: reps ? parseInt(reps, 10) : undefined,
              weight: weight ? parseInt(weight, 10) : undefined,
              repetitionUnitId: repUnit.id,
              weightUnitId: weightUnit.id,
            });
            onClose();
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
