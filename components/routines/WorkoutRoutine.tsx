import moment from "moment";
import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import { Workout } from "@/types/privateApi/workout";
import { PaginatedResponse } from "@/types/response";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import useSWR from "swr";
import { WorkoutDay } from "./WorkoutDay";
import styles from "@/styles/workoutRoutine.module.css";
import { Delete, Edit } from "@mui/icons-material";
import { DeleteRoutineModal } from "./DeleteRoutineModal";
import { useState } from "react";

export const WorkoutRoutine = ({
  workout,
  onEdit,
  deleteRoutine,
}: {
  workout: Workout;
  onEdit: () => void;
  deleteRoutine: (id: number) => Promise<void>;
}) => {
  const { data: workoutDay } = useSWR<PaginatedResponse<Day>>(
    `/day?training=${workout.id}`,
    useAuthFetcher(),
  );
  const [showDeleteModal, setDeleteModal] = useState(false);
  const namespace = `workout-${workout.id}`;

  return (
    <>
      <DeleteRoutineModal
        open={showDeleteModal}
        onClose={() => setDeleteModal(false)}
        deleteRoutine={() => deleteRoutine(workout.id)}
      />
      <Card>
        <CardHeader
          action={
            <>
              <IconButton
                aria-label={`Edit routine: ${workout.name}`}
                onClick={onEdit}
              >
                <Edit />
              </IconButton>
              <IconButton
                aria-label={`Delete routine: ${workout.name}`}
                onClick={() => setDeleteModal(true)}
              >
                <Delete />
              </IconButton>
            </>
          }
          title={workout.name}
          subheader={
            <>
              {workout.description && (
                <Typography variant="subtitle2">
                  {workout.description}
                </Typography>
              )}
              <Typography variant="caption" gutterBottom>
                {moment(workout.creation_date).format("MM/DD/YYYY")}
              </Typography>
            </>
          }
        />
        <CardContent>
          <div className={styles.workoutDayContainer}>
            {workoutDay?.results.map((workoutDay) => {
              const dayNamespace = `${namespace}-day-${workoutDay.id}`;
              return (
                <WorkoutDay
                  key={dayNamespace}
                  namespace={dayNamespace}
                  day={workoutDay}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
