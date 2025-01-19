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
import { SessionWithSets } from "@/types/workoutSession";

export const SessionSummaryCard = ({
  session: { id, name, startTime, endTime, impression, notes },
}: {
  session: SessionWithSets;
}) => {
  const durationDate =
    startTime && endTime
      ? moment.duration(moment(endTime).diff(moment(startTime)))
      : null;
  const durationString = durationDate
    ? `${durationDate.hours()} hours, ${durationDate.minutes()} mins`
    : "Not entered";

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
              {name}
            </Typography>
            <Chip
              variant="outlined"
              label={moment(startTime).format("MM/DD/YYYY")}
            />
          </>
        }
        disableTypography
        action={<EditSessionMenu sessionId={id} />}
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
                impression ? (
                  <Rating size="small" max={3} value={impression} readOnly />
                ) : (
                  "Not rated"
                )
              }
            />
          </ListItem>

          {notes && (
            <ListItem disableGutters>
              <ListItemText primary="Notes" secondary={notes} />
            </ListItem>
          )}
        </List>
      </CardContent>

      <CardActions sx={{ alignSelf: "flex-end" }}>
        <Button LinkComponent={Link} href={`/session/${id}`}>
          View Session
        </Button>
      </CardActions>
    </Card>
  );
};
