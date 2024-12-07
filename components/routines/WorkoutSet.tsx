/** @jsxImportSource @emotion/react */
import { useAuthFetcher } from "@/lib/fetcher";
import { Setting } from "@/types/privateApi/setting";
import useSWR from "swr";
import type { PaginatedResponse } from "@/types/response";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Error, Image as ImageIcon } from "@mui/icons-material";
import { ExerciseBaseInfo } from "@/types/publicApi/exerciseBaseInfo";
import { WorkoutSetting } from "./WorkoutSetting";
import { css } from "@emotion/react";

export const WorkoutSet = ({ setId }: { dayId: number; setId: number }) => {
  const authFetcher = useAuthFetcher();
  const { data: setting, isLoading: settingLoading } = useSWR<
    PaginatedResponse<Setting>
  >(`/setting?set=${setId}`, authFetcher);

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
    <ListItem>
      <ListItemButton>
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
          secondary={
            <span
              css={css`
                display: flex;
                gap: 0.5rem;
                margin-top: 5px;
                flex-wrap: wrap;
              `}
            >
              <span>{setting.count} sets</span>
              {setting.results.map((currentSet) => (
                <WorkoutSetting
                  key={`setting-${currentSet.id}`}
                  settingId={currentSet.id}
                />
              ))}
            </span>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
