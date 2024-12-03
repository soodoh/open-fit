import { useAuthFetcher } from "@/lib/fetcher";
import { Setting } from "@/types/privateApi/setting";
import useSWR from "swr";
import type { PaginatedResponse } from "@/types/response";
import type { WorkoutSetType } from "@/types/privateApi/set";
import {
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Error,
  ExpandLess,
  ExpandMore,
  Image as ImageIcon,
} from "@mui/icons-material";
import { ExerciseBaseInfo } from "@/types/publicApi/exerciseBaseInfo";
import { useState } from "react";
import { WorkoutSetting } from "./WorkoutSetting";

export const WorkoutSet = ({ set }: { set: WorkoutSetType }) => {
  const { data: setting, isLoading: settingLoading } = useSWR<
    PaginatedResponse<Setting>
  >(`/setting?set=${set.id}`, useAuthFetcher());

  const exerciseBaseId = setting?.results[0]?.exercise_base;
  const { data: exerciseBaseInfo, isLoading: exerciseLoading } =
    useSWR<ExerciseBaseInfo>(
      Number.isInteger(exerciseBaseId) && `/exercisebaseinfo/${exerciseBaseId}`,
      useAuthFetcher(),
    );

  const isLoading = settingLoading || exerciseLoading;
  const imageUrl = exerciseBaseInfo?.images?.[0]?.image;
  const exercise = exerciseBaseInfo?.exercises.find(
    (exercise) => exercise.language === 2,
  );

  const [open, setOpen] = useState(false);

  if (isLoading) {
    return null;
  }

  if (!setting || !exercise) {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <Error />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Unknown Exercise" />
      </ListItem>
    );
  }

  return (
    <>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemAvatar>
          {imageUrl ? (
            <Avatar alt={`${exercise.name} set item`} src={imageUrl} />
          ) : (
            <Avatar>
              <ImageIcon />
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={exercise.name}
          secondary={`${set.sets} total sets`}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          {setting.results.map((currentSet) => (
            <WorkoutSetting
              key={`set-${set.id}-day-${set.exerciseday}-exercise-${exercise.uuid}-${currentSet.id}`}
              setting={currentSet}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};
