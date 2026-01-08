import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import { Pause, Play, Plus, Timer } from "lucide-react";
import { useTimer } from "react-timer-hook";

export const RestTimer = ({
  open,
  setOpen,
  totalSeconds,
  setTotalSeconds,
  timer,
}: {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  totalSeconds: number;
  setTotalSeconds: (seconds: number) => void;
  timer: ReturnType<typeof useTimer>;
}) => {
  const {
    isRunning,
    totalSeconds: remainingSeconds,
    start,
    pause,
    restart,
  } = timer;
  const percentage = (remainingSeconds / totalSeconds) * 100;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rest Timer</DialogTitle>
          </DialogHeader>

          <div className="relative flex justify-center items-center">
            {/* Background circle */}
            <svg
              className="w-48 h-48 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                className="text-primary transition-all duration-1000 ease-in-out"
                strokeLinecap="round"
              />
            </svg>

            {/* Timer content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold">
                {dayjs.duration(remainingSeconds, "seconds").format("mm:ss")}
              </h2>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
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
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (isRunning) {
                      pause();
                    } else {
                      start();
                    }
                  }}
                >
                  {isRunning ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
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
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                restart(dayjs().add(totalSeconds, "seconds").toDate(), false);
              }}
            >
              Skip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative m-1.5">
        <Button
          size="sm"
          variant="outline"
          className="rounded-full w-12 h-12 p-0 relative"
          onClick={() => setOpen(!open)}
        >
          <Timer className="h-4 w-4" />
          <svg
            className="absolute inset-0 w-12 h-12 transform -rotate-90"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 10}`}
              strokeDashoffset={`${2 * Math.PI * 10 * (1 - percentage / 100)}`}
              className="text-green-500 transition-all duration-1000 ease-in-out"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </div>
    </>
  );
};
