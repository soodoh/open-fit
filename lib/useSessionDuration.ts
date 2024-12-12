import { WorkoutSession } from "@/types/privateApi/workoutSession";
import { useAuthedSWR } from "./fetcher";
import moment from "moment";

export function useSessionDuration(sessionId?: number) {
  const { data: session } = useAuthedSWR<WorkoutSession>(
    `/workoutsession/${sessionId}`,
  );

  const endDate =
    session?.date && session?.time_end
      ? `${session.date}T${session?.time_end}`
      : null;
  const startDate =
    session?.date && session?.time_start
      ? `${session.date}T${session?.time_start}`
      : null;

  const durationDate =
    startDate && endDate
      ? moment.duration(moment(endDate).diff(moment(startDate)))
      : null;

  return durationDate
    ? `${durationDate.hours()} hours, ${durationDate.minutes()} mins`
    : "Not entered";
}
