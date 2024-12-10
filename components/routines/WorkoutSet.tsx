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
import { DragHandle, Error, Image as ImageIcon } from "@mui/icons-material";
import { ExerciseBaseInfo } from "@/types/publicApi/exerciseBaseInfo";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const WorkoutSet = ({ setId }: { dayId: number; setId: number }) => {
  const authFetcher = useAuthFetcher();
  const { data: setting, isLoading: settingLoading } = useSWR<
    PaginatedResponse<Setting>
  >(`/setting?set=${setId}`, authFetcher);

  const exerciseBaseId = setting?.results?.[0]?.exercise_base;
  const { data: exerciseBaseInfo, isLoading: exerciseLoading } =
    useSWR<ExerciseBaseInfo>(
      Number.isInteger(exerciseBaseId) && `/exercisebaseinfo/${exerciseBaseId}`,
      useAuthFetcher(),
    );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setId });

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
    <ListItem
      dense
      disablePadding
      ref={setNodeRef}
      sx={{ transform: CSS.Transform.toString(transform), transition }}
      secondaryAction={<DragHandle {...attributes} {...listeners} />}
    >
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
          secondary={`${setting.count} sets`}
        />
      </ListItemButton>
    </ListItem>
  );
};
