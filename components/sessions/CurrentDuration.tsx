"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

const getTimestamp = (startTime: Date | number) =>
  dayjs.duration(dayjs().diff(dayjs(startTime))).format("H:mm:ss");

export const CurrentDuration = ({
  startTime,
}: {
  startTime: Date | number;
}) => {
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
    <div>
      <p className="text-xs text-muted-foreground">Duration</p>
      <p className="text-sm font-semibold tabular-nums">{durationString}</p>
    </div>
  );
};
