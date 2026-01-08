"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";

const getTimestamp = (startTime: Date | number) =>
  dayjs.duration(dayjs().diff(dayjs(startTime))).format("H:mm:ss");

export const CurrentDuration = ({ startTime }: { startTime: Date | number }) => {
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
      <h3 className="text-sm font-medium">Duration</h3>
      <p className="text-sm text-muted-foreground">{durationString}</p>
    </div>
  );
};
