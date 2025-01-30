"use client";

import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const getTimestamp = (startTime: Date) =>
  dayjs.duration(dayjs().diff(dayjs(startTime))).format("H:mm:ss");

export const CurrentDuration = ({ startTime }: { startTime: Date }) => {
  const [durationString, setDuration] = useState<string>(
    getTimestamp(startTime),
  );

  useEffect(() => {
    const timeout = setInterval(() => {
      setDuration(getTimestamp(startTime));
    }, 1000);
    return () => clearInterval(timeout);
  }, [startTime]);

  return (
    <Box>
      <Typography variant="subtitle1">Duration</Typography>
      <Typography variant="subtitle2">{durationString}</Typography>
    </Box>
  );
};
