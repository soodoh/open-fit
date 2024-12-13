import { fetcher, useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import {
  getSetting,
  getSettings,
  REPETITION_UNITS,
  WEIGHT_UNITS,
} from "@/lib/urls";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";
import { Setting } from "@/types/privateApi/setting";
import { RepetitionUnit } from "@/types/publicApi/repetitionUnit";
import { WeightUnit } from "@/types/publicApi/weightUnit";
import { PaginatedResponse } from "@/types/response";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Delete, DragHandle } from "@mui/icons-material";
import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import useSWR from "swr";

export const EditSettingRow = ({ settingId }: { settingId: number }) => {
  const authFetcher = useAuthFetcher();

  const { data: setting, mutate: mutateSetting } = useAuthedSWR<Setting>(
    getSetting(settingId),
  );
  const { data: settings, mutate: mutateSettings } = useAuthedSWR<
    PaginatedResponse<Setting>
  >(getSettings(setting?.set));
  const { data: repUnits } = useSWR<PaginatedResponse<RepetitionUnit>>(
    REPETITION_UNITS,
    fetcher,
  );
  const repUnitLabel = repUnits?.results?.find(
    (unit) => unit.id === setting?.repetition_unit,
  )?.name;
  const { data: weightUnits } = useSWR<PaginatedResponse<WeightUnit>>(
    WEIGHT_UNITS,
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: settingId });

  useEffect(() => {
    setReps(setting?.reps?.toString() ?? "0");
    setRepUnit(setting?.repetition_unit?.toString() ?? "1");
    setWeight(parseFloat(setting?.weight ?? "0").toString());
    setWeightUnit(setting?.weight_unit?.toString() ?? defaultWeightUnit);
  }, [defaultWeightUnit, setting]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newSetting = await authFetcher(getSetting(settingId), {
      method: "PATCH",
      body: JSON.stringify({
        reps: parseInt(reps, 10),
        repetition_unit: parseInt(repUnit, 10),
        weight,
        weight_unit: parseInt(weightUnit, 10),
      }),
    });
    mutateSetting(newSetting);
    setEdit(false);
  };

  const handleDelete = async () => {
    // Don't delete the only set, delete the parent instead
    if (settings?.results && settings.results.length <= 1) {
      return;
    }

    const deletePromise = authFetcher(getSetting(settingId), {
      method: "DELETE",
    });
    // Optimistic update
    mutateSettings(deletePromise, {
      populateCache: (_, cachedSettings) => {
        const newSettings =
          cachedSettings?.results?.filter(
            (current) => current.id !== settingId,
          ) ?? [];
        return {
          ...cachedSettings,
          count: newSettings.length,
          results: newSettings,
        };
      },
      revalidate: false,
      rollbackOnError: true,
    });
  };

  const dragHandle = (
    <ListItemIcon>
      <IconButton
        sx={{ mx: 2, touchAction: "manipulation" }}
        {...attributes}
        {...listeners}
      >
        <DragHandle />
      </IconButton>
    </ListItemIcon>
  );

  if (!edit) {
    return (
      <ListItem
        dense
        disablePadding
        ref={setNodeRef}
        sx={{ transform: CSS.Transform.toString(transform), transition }}
        secondaryAction={
          // Cannot delete the only setting in the set
          settings?.results &&
          settings.results.length > 1 && (
            <IconButton onClick={handleDelete}>
              <Delete />
            </IconButton>
          )
        }
      >
        <ListItemButton onClick={() => setEdit(true)} disableGutters>
          {dragHandle}
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
      dense
      disablePadding
      ref={setNodeRef}
      sx={{ transform: CSS.Transform.toString(transform), transition }}
      component="form"
      onSubmit={handleSubmit}
      secondaryAction={
        <IconButton type="submit">
          <Check />
        </IconButton>
      }
    >
      {dragHandle}

      <Box sx={{ display: "flex", gap: 2, my: 1 }}>
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
