import { useAuthedSWR } from "@/lib/fetcher";
import { useSessionDuration } from "@/lib/useSessionDuration";
import { Day } from "@/types/privateApi/day";
import { Workout } from "@/types/privateApi/workout";
import { WorkoutSession } from "@/types/privateApi/workoutSession";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Rating,
  Typography,
} from "@mui/material";
import moment from "moment";
import Link from "next/link";

export const SessionSummaryCard = ({ sessionId }: { sessionId: number }) => {
  const { data: session } = useAuthedSWR<WorkoutSession>(
    `/workoutsession/${sessionId}`,
  );
  const { data: day } = useAuthedSWR<Day>(
    session?.workout ? `/day/${session.workout}` : null,
  );
  const { data: workout } = useAuthedSWR<Workout>(
    day?.training ? `/workout/${day.training}` : null,
  );

  const durationString = useSessionDuration(sessionId);

  return (
    <Card>
      <CardHeader
        title={day?.description ?? "Workout Session"}
        subheader={
          <>
            <Typography variant="subtitle2" gutterBottom>
              {workout?.name}
            </Typography>
            <Chip
              variant="outlined"
              label={moment(session?.date).format("MM/DD/YYYY")}
            />
          </>
        }
      />

      <CardContent>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center" }}
        >
          Rating:{" "}
          {
            <Rating
              size="small"
              max={3}
              value={session?.impression ? parseInt(session.impression) : null}
              readOnly
            />
          }
        </Typography>
        <Typography variant="body2">Duration: {durationString}</Typography>
        {session?.notes && (
          <Typography variant="body1">{session?.notes}</Typography>
        )}
      </CardContent>

      <CardActions>
        <Button LinkComponent={Link} href={`/session/${session?.id}`}>
          View Session
        </Button>
      </CardActions>
    </Card>
  );
};
