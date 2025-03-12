import { SetWithRelations } from "@/types/workoutSet";
import { Pause, PlayArrow, Timer, Timer10 } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";

export const WorkoutTimer = ({
  set,
  onComplete,
}: {
  set: SetWithRelations;
  onComplete: () => Promise<void>;
}) => {
  const [isTimerOpen, setTimerOpen] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState<number>(set.reps);
  const expiryTimestamp = dayjs().add(totalSeconds, "seconds").toDate();
  const {
    isRunning,
    totalSeconds: remainingSeconds,
    start,
    pause,
    restart,
  } = useTimer({
    expiryTimestamp,
    autoStart: false,
  });
  const percentage = !totalSeconds
    ? 0
    : (remainingSeconds / totalSeconds) * 100;

  useEffect(() => {
    setTotalSeconds(set.reps);
  }, [set.reps]);

  useEffect(() => {
    if (isTimerOpen) {
      start();
    }
  }, [isTimerOpen, start]);

  return (
    <>
      <Dialog
        open={isTimerOpen}
        onClose={() => setTimerOpen(false)}
        aria-labelledby="workout-timer-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="workout-timer-title">Workout Timer</DialogTitle>
        <DialogContent>
          <Box sx={{ position: "relative", display: "flex" }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size="100%"
              thickness={2}
              sx={{
                position: "absolute",
                color: grey[200],
              }}
            />
            <CircularProgress
              variant="determinate"
              value={percentage}
              size="100%"
              thickness={2}
              color="primary"
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="h3">
                  {dayjs.duration(remainingSeconds, "seconds").format("mm:ss")}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <Fab
                    size="small"
                    color="default"
                    onClick={() => {
                      setTotalSeconds(Math.max(0, totalSeconds - 10));
                      restart(
                        dayjs()
                          .add(Math.max(0, remainingSeconds - 10), "seconds")
                          .toDate(),
                        isRunning,
                      );
                    }}
                  >
                    <Timer10 />
                  </Fab>
                  <Fab
                    size="small"
                    onClick={() => {
                      if (isRunning) {
                        pause();
                      } else {
                        start();
                      }
                    }}
                  >
                    {isRunning ? <Pause /> : <PlayArrow />}
                  </Fab>
                  <Fab
                    size="small"
                    color="primary"
                    onClick={() => {
                      setTotalSeconds(totalSeconds + 10);
                      restart(
                        dayjs()
                          .add(remainingSeconds + 10, "seconds")
                          .toDate(),
                        isRunning,
                      );
                    }}
                  >
                    <Timer10 />
                  </Fab>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimerOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={async () => {
              setTimerOpen(false);
              await onComplete();
            }}
          >
            Mark as Completed
          </Button>
        </DialogActions>
      </Dialog>

      <Box>
        <IconButton
          size="small"
          color="default"
          onClick={() => setTimerOpen(!isTimerOpen)}
          sx={{ position: "relative", margin: "5px" }}
        >
          {!isRunning && remainingSeconds < totalSeconds ? (
            <Pause fontSize="small" />
          ) : (
            <Timer fontSize="small" />
          )}

          <CircularProgress
            variant="determinate"
            value={percentage}
            size={35}
            thickness={3}
            sx={{
              color: grey[500],
              position: "absolute",
            }}
          />
        </IconButton>
      </Box>
    </>
  );
};
