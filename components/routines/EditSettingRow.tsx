import { fetcher, useAuthFetcher } from "@/lib/fetcher";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";
import { Setting } from "@/types/privateApi/setting";
import { RepetitionUnit } from "@/types/publicApi/repetitionUnit";
import { WeightUnit } from "@/types/publicApi/weightUnit";
import { PaginatedResponse } from "@/types/response";
import { Delete } from "@mui/icons-material";
import { Box, IconButton, ListItem, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
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
  const { data: weightUnits } = useSWR<PaginatedResponse<WeightUnit>>(
    "/setting-weightunit?ordering=id",
    fetcher,
  );

  const defaultWeightUnit = useDefaultWeightUnit().toString();
  const [reps, setReps] = useState<string>("0");
  const [repUnit, setRepUnit] = useState<string>("1");
  const [weight, setWeight] = useState<string>("0");
  const [weightUnit, setWeightUnit] = useState<string>(defaultWeightUnit);

  return (
    <ListItem
      sx={{ pl: 4 }}
      secondaryAction={
        <IconButton>
          <Delete />
        </IconButton>
      }
    >
      <Box sx={{ display: "flex", gap: 2 }}>
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
