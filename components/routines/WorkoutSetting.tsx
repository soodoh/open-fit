import useSWR from "swr";
import type { Setting } from "@/types/privateApi/setting";
import { Chip } from "@mui/material";
import { fetcher, useAuthFetcher } from "@/lib/fetcher";
import { WeightUnit } from "@/types/publicApi/weightUnit";

export const WorkoutSetting = ({ settingId }: { settingId: number }) => {
  const authFetcher = useAuthFetcher();
  const { data: setting } = useSWR<Setting>(
    `/setting/${settingId}`,
    authFetcher,
  );
  const { data: weightUnit } = useSWR<WeightUnit>(
    setting?.weight_unit ? `/setting-weightunit/${setting.weight_unit}` : null,
    fetcher,
  );

  const weightLabel =
    (setting?.weight ? parseFloat(setting?.weight) + " " : "") +
    (weightUnit?.name ?? "");
  return (
    <Chip
      component="span"
      label={`${setting?.reps} x ${weightLabel}`}
      size="small"
      variant="filled"
    />
  );
};
