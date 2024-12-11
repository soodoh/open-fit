import { fetcher, useAuthFetcher } from "@/lib/fetcher";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";
import { Setting } from "@/types/privateApi/setting";
import { RepetitionUnit } from "@/types/publicApi/repetitionUnit";
import { WeightUnit } from "@/types/publicApi/weightUnit";
import { PaginatedResponse } from "@/types/response";
import { Check, Delete } from "@mui/icons-material";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import useSWR from "swr";

export const EditSettingRow = ({ settingId }: { settingId: number }) => {
  const authFetcher = useAuthFetcher();

  const { data: setting, mutate } = useSWR<Setting>(
    `/setting/${settingId}`,
    authFetcher,
  );
  const { data: repUnits } = useSWR<PaginatedResponse<RepetitionUnit>>(
    "/setting-repetitionunit?ordering=id",
    fetcher,
  );
  const repUnitLabel = repUnits?.results?.find(
    (unit) => unit.id === setting?.repetition_unit,
  )?.name;
  const { data: weightUnits } = useSWR<PaginatedResponse<WeightUnit>>(
    "/setting-weightunit?ordering=id",
    fetcher,
  );
  const weightUnitLabel = weightUnits?.results?.find(
    (unit) => unit.id === setting?.weight_unit,
  )?.name;

  const defaultWeightUnit = useDefaultWeightUnit().toString();
  const [reps, setReps] = useState<string>("0");
  const [repUnit, setRepUnit] = useState<string>("1");
  const [weight, setWeight] = useState<string>("0");
  const [weightUnit, setWeightUnit] = useState<string>(defaultWeightUnit);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setReps(setting?.reps?.toString() ?? "0");
    setRepUnit(setting?.repetition_unit?.toString() ?? "1");
    setWeight(parseFloat(setting?.weight ?? "0").toString());
    setWeightUnit(setting?.weight_unit?.toString() ?? defaultWeightUnit);
  }, [defaultWeightUnit, setting]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newSetting = await authFetcher(`/setting/${settingId}/`, {
      method: "PATCH",
      body: JSON.stringify({
        reps: parseInt(reps, 10),
        repetition_unit: parseInt(repUnit, 10),
        weight,
        weight_unit: parseInt(weightUnit, 10),
      }),
    });
    mutate(newSetting);
    setEdit(false);
  };

  if (!edit) {
    return (
      <ListItem
        dense
        disablePadding
        sx={{ pl: 4 }}
        secondaryAction={
          <IconButton>
            <Delete />
          </IconButton>
        }
      >
        <ListItemButton onClick={() => setEdit(true)}>
          <ListItemText
            primary={`${setting?.reps ?? 0} ${repUnitLabel}`}
            secondary={`${parseFloat(setting?.weight ?? "0")} ${weightUnitLabel}`}
          />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <ListItem
      sx={{ pl: 4, display: "flex", gap: 2 }}
      component="form"
      onSubmit={handleSubmit}
      secondaryAction={
        <IconButton type="submit">
          <Check />
        </IconButton>
      }
    >
      <TextField
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
          label="Unit"
          value={weightUnit}
          onChange={(event) => setWeightUnit(event.target.value)}
          sx={{ minWidth: 70, maxWidth: 150 }}
        >
          {weightUnits?.results?.map((weightUnit) => (
            <MenuItem key={`weightUnit-${weightUnit.id}`} value={weightUnit.id}>
              {weightUnit.name}
            </MenuItem>
          ))}
        </TextField>
      )}
    </ListItem>
  );
};
