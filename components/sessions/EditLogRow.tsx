import { fetcher, useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";
import { WorkoutLog } from "@/types/privateApi/workoutLog";
import { WorkoutSession } from "@/types/privateApi/workoutSession";
import { RepetitionUnit } from "@/types/publicApi/repetitionUnit";
import { WeightUnit } from "@/types/publicApi/weightUnit";
import { PaginatedResponse } from "@/types/response";
import { Check, Delete } from "@mui/icons-material";
import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import useSWR from "swr";

export const EditLogRow = ({
  sessionId,
  logId,
}: {
  sessionId: number;
  logId: number;
}) => {
  const authFetcher = useAuthFetcher();

  const { data: repUnits } = useSWR<PaginatedResponse<RepetitionUnit>>(
    "/setting-repetitionunit?ordering=id",
    fetcher,
  );
  const { data: weightUnits } = useSWR<PaginatedResponse<WeightUnit>>(
    "/setting-weightunit?ordering=id",
    fetcher,
  );
  const { data: workoutLog, mutate } = useAuthedSWR<WorkoutLog>(
    `/workoutlog/${logId}`,
  );
  const { data: session } = useAuthedSWR<WorkoutSession>(
    `/workoutsession/${sessionId}`,
  );
  const { data: workoutLogs, mutate: mutateLogs } = useAuthedSWR<
    PaginatedResponse<WorkoutLog>
  >(
    session?.date && workoutLog?.exercise_base
      ? `/workoutlog?ordering=id&date=${session.date}&exercise_base=${workoutLog.exercise_base}`
      : null,
  );

  const weightUnitLabel = weightUnits?.results?.find(
    (unit) => unit.id === workoutLog?.weight_unit,
  )?.name;
  const repUnitLabel = repUnits?.results?.find(
    (unit) => unit.id === workoutLog?.repetition_unit,
  )?.name;

  const defaultWeightUnit = useDefaultWeightUnit().toString();
  const [reps, setReps] = useState<string>("0");
  const [repUnit, setRepUnit] = useState<string>("1");
  const [weight, setWeight] = useState<string>("0");
  const [weightUnit, setWeightUnit] = useState<string>(defaultWeightUnit);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setReps(workoutLog?.reps?.toString() ?? "0");
    setRepUnit(workoutLog?.repetition_unit?.toString() ?? "1");
    setWeight(parseFloat(workoutLog?.weight ?? "0").toString());
    setWeightUnit(workoutLog?.weight_unit?.toString() ?? defaultWeightUnit);
  }, [defaultWeightUnit, workoutLog]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(
      authFetcher(`/workoutlog/${logId}/`, {
        method: "PATCH",
        body: JSON.stringify({
          reps: parseInt(reps, 10),
          repetition_unit: parseInt(repUnit, 10),
          weight,
          weight_unit: parseInt(weightUnit, 10),
        }),
      }),
      { revalidate: false },
    );
    setEdit(false);
  };

  const handleDelete = async () => {
    await authFetcher(`/workoutlog/${logId}/`, {
      method: "DELETE",
    });
    // Optimistic update
    const newLogs =
      workoutLogs?.results?.filter((current) => current.id === logId) ?? [];
    mutateLogs({
      ...workoutLogs,
      count: newLogs.length,
      results: newLogs,
    });
  };

  if (!edit) {
    return (
      <ListItem
        dense
        disablePadding
        secondaryAction={
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>
        }
      >
        <ListItemButton onClick={() => setEdit(true)}>
          <ListItemText
            primary={`${workoutLog?.reps ?? 0} ${repUnitLabel}`}
            secondary={`${parseFloat(workoutLog?.weight ?? "0")} ${weightUnitLabel}`}
          />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <ListItem
      dense
      component="form"
      onSubmit={handleSubmit}
      secondaryAction={
        <IconButton type="submit">
          <Check />
        </IconButton>
      }
    >
      <Box sx={{ display: "flex", gap: 2, my: 1 }}>
        <TextField
          size="small"
          variant="outlined"
          type="number"
          label="Reps"
          slotProps={{
            htmlInput: { min: 0 },
          }}
          value={reps}
          onChange={(event) => setReps(event.target.value)}
          sx={{ width: 75 }}
        />
        {repUnits?.results && (
          <TextField
            select
            size="small"
            label="Type"
            value={repUnit}
            onChange={(event) => setRepUnit(event.target.value)}
            sx={{ minWidth: 100, maxWidth: 150 }}
          >
            {repUnits?.results?.map((repUnit) => (
              <MenuItem key={`repUnit-${repUnit.id}`} value={repUnit.id}>
                {repUnit.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          size="small"
          variant="outlined"
          type="number"
          label="Weight"
          slotProps={{
            htmlInput: { min: 0 },
          }}
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          sx={{ minWidth: 75, maxWidth: 100 }}
        />
        {weightUnits?.results && (
          <TextField
            select
            size="small"
            label="Unit"
            value={weightUnit}
            onChange={(event) => setWeightUnit(event.target.value)}
            sx={{ minWidth: 70, maxWidth: 150 }}
          >
            {weightUnits?.results?.map((weightUnit) => (
              <MenuItem
                key={`weightUnit-${weightUnit.id}`}
                value={weightUnit.id}
              >
                {weightUnit.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>
    </ListItem>
  );
};
