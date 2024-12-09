import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { DaysOfWeek } from "@/types/publicApi/daysOfWeek";
import { Chip } from "@mui/material";

export const Weekday = ({ weekday }: { weekday: number; isLast?: boolean }) => {
  const { data: dayOfWeek } = useSWR<DaysOfWeek>(
    `/daysofweek/${weekday}`,
    fetcher,
  );
  const dayString = dayOfWeek?.day_of_week ?? "Unknown";

  return <Chip label={dayString} />;
};
