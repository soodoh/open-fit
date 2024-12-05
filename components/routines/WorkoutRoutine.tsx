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
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import useSWR from "swr";
import { WorkoutDay } from "./WorkoutDay";
import styles from "@/styles/workoutRoutine.module.css";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { DeleteRoutineModal } from "./DeleteRoutineModal";
import { useState } from "react";

export const WorkoutRoutine = ({
  workoutId,
  onEdit,
}: {
  workoutId: number;
  onEdit: () => void;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: workout } = useSWR<Workout>(
    `/workout/${workoutId}`,
    authFetcher,
  );
  const { data: workoutDay } = useSWR<PaginatedResponse<Day>>(
    `/day?training=${workoutId}`,
    authFetcher,
  );
  const [showDeleteModal, setDeleteModal] = useState(false);
  const namespace = `workout-${workoutId}`;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  if (!workout) {
    return null;
  }
  return (
    <div>
      <DeleteRoutineModal
        open={showDeleteModal}
        onClose={() => setDeleteModal(false)}
        workoutId={workoutId}
      />
      <Card>
        <CardHeader
          action={
            <div>
              <IconButton
                aria-label={`Edit actions for ${workout.name}`}
                id={`edit-actions-${workout.id}`}
                aria-controls={
                  menuOpen ? `edit-actions-${workout.id}-menu` : undefined
                }
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  setAnchorEl(event.currentTarget);
                }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                id={`edit-actions-${workout.id}-menu`}
                aria-labelledby="edit-actions"
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      onEdit();
                    }}
                  >
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      setDeleteModal(true);
                    }}
                  >
                    <ListItemIcon>
                      <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
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
                  workoutId={workoutId}
                  dayId={workoutDay.id}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
