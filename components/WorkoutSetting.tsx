import useSWR from "swr";
import type { Setting } from "@/types/privateApi/setting";
import { Chip } from "@mui/material";
import { fetcher } from "@/lib/fetcher";
import { WeightUnit } from "@/types/publicApi/weightUnit";

export const WorkoutSetting = ({
  setting: { repetition_unit, weight_unit, reps, weight },
}: {
  setting: Setting;
}) => {
  // const { data: repetitionUnit } = useSWR<RepetitionUnit>(
  //   repetition_unit ? `/setting-repetitionunit/${repetition_unit}` : null,
  //   fetcher,
  // );
  const { data: weightUnit } = useSWR<WeightUnit>(
    weight_unit ? `/setting-weightunit/${weight_unit}` : null,
    fetcher,
  );

  const weightLabel =
    (weight ? parseFloat(weight) + " " : "") + (weightUnit?.name ?? "");
  return (
    <Chip
      component="span"
      label={`${reps} x ${weightLabel}`}
      size="small"
      variant="filled"
    />
  );
};
