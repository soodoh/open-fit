import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { DaysOfWeek } from "@/types/publicApi/daysOfWeek";

export const Weekday = ({
  weekday,
  isLast = false,
}: {
  weekday: number;
  isLast?: boolean;
}) => {
  const { data: dayOfWeek } = useSWR<DaysOfWeek>(
    `/daysofweek/${weekday}`,
    fetcher,
  );
  const dayString = dayOfWeek?.day_of_week ?? "Unknown";

  return dayString + (!isLast ? ", " : "");
};
