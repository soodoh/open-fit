import { useAuthedSWR } from "@/lib/fetcher";
import { useSessionDuration } from "@/lib/useSessionDuration";
import { Workout } from "@/types/privateApi/workout";
import { WorkoutSession } from "@/types/privateApi/workoutSession";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { EditSessionMenu } from "./EditSessionMenu";
import { getSession, getWorkout } from "@/lib/urls";

export const SessionSummaryCard = ({ sessionId }: { sessionId?: number }) => {
  const { data: session } = useAuthedSWR<WorkoutSession>(getSession(sessionId));
  const { data: workout } = useAuthedSWR<Workout>(getWorkout(session?.workout));

  const durationString = useSessionDuration(sessionId);

  return (
    <Card
      sx={{
        minWidth: 300,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={
          <>
            <Typography variant="h6" gutterBottom sx={{ mr: 2 }}>
              {workout?.name || "Unknown Routine"}
            </Typography>
            <Chip
              variant="outlined"
              label={moment(session?.date).format("MM/DD/YYYY")}
            />
          </>
        }
        disableTypography
        action={<EditSessionMenu sessionId={sessionId} />}
      />

      <CardContent sx={{ py: 0, flexGrow: 1 }}>
        <List dense>
          <ListItem disableGutters>
            <ListItemText primary="Duration" secondary={durationString} />
          </ListItem>

          <ListItem disableGutters>
            <ListItemText
              primary="General Impression"
              secondary={
                <Rating
                  size="small"
                  max={3}
                  value={
                    session?.impression ? parseInt(session.impression) : null
                  }
                  readOnly
                />
              }
            />
          </ListItem>

          {session?.notes && (
            <ListItem disableGutters>
              <ListItemText primary="Notes" secondary={session.notes} />
            </ListItem>
          )}
        </List>
      </CardContent>

      <CardActions sx={{ alignSelf: "flex-end" }}>
        <Button LinkComponent={Link} href={`/session/${sessionId}`}>
          View Session
        </Button>
      </CardActions>
    </Card>
  );
};
