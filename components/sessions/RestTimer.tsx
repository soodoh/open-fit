"use client";

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
  Typography,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import dayjs from "dayjs";
import { useState } from "react";
import { useTimer } from "react-timer-hook";

export const RestTimer = () => {
  const [totalSeconds, setTotalSeconds] = useState<number>(90);
  const [open, setOpen] = useState(false);
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
  const percentage = (remainingSeconds / totalSeconds) * 100;

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="rest-timer-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="rest-timer-title">Rest Timer</DialogTitle>
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
                      setTotalSeconds(totalSeconds - 10);
                      restart(
                        dayjs()
                          .add(remainingSeconds - 10, "seconds")
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
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>
            Skip
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ position: "relative", margin: "6px" }}>
        <Fab size="small" color="default" onClick={() => setOpen(!open)}>
          <Timer />
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={52}
            thickness={5}
            sx={{
              color: green[500],
              position: "absolute",
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        </Fab>
      </Box>
    </>
  );
};
