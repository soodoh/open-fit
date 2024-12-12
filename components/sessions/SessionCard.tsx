import { useAuthedSWR } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import { Workout } from "@/types/privateApi/workout";
import { WorkoutSession } from "@/types/privateApi/workoutSession";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import moment from "moment";
import Link from "next/link";

export const SessionCard = ({ sessionId }: { sessionId: number }) => {
  const { data: session } = useAuthedSWR<WorkoutSession>(
    `/workoutsession/${sessionId}`,
  );
  const { data: day } = useAuthedSWR<Day>(
    session?.workout ? `/day/${session.workout}` : null,
  );
  const { data: workout } = useAuthedSWR<Workout>(
    day?.training ? `/workout/${day.training}` : null,
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
  const durationString = durationDate
    ? `${durationDate.hours()} hours, ${durationDate.minutes()} mins`
    : "Not entered";

  return (
    <Card>
      <CardHeader
        title={
          <>
            <Typography variant="h6">{day?.description}</Typography>
            <Typography variant="subtitle2">{workout?.name}</Typography>
          </>
        }
        subheader={moment(session?.date).format("MM/DD/YYYY")}
        // action={<EditRoutineMenu workoutId={workoutId} />}
      />

      <CardContent>
        {session?.notes && (
          <Typography variant="body1">{session?.notes}</Typography>
        )}
        <Typography variant="body2">Duration: {durationString}</Typography>
      </CardContent>

      <CardActions>
        <Button LinkComponent={Link} href={`/session/${session?.id}`}>
          View Session
        </Button>
      </CardActions>
    </Card>
  );
};
