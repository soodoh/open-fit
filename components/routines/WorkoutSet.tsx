import { useAuthFetcher } from "@/lib/fetcher";
import { Setting } from "@/types/privateApi/setting";
import useSWR from "swr";
import type { PaginatedResponse } from "@/types/response";
import {
  Avatar,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  DragHandle,
  Error,
  ExpandLess,
  Image as ImageIcon,
} from "@mui/icons-material";
import { ExerciseBaseInfo } from "@/types/publicApi/exerciseBaseInfo";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export const WorkoutSet = ({ setId }: { dayId: number; setId: number }) => {
  const authFetcher = useAuthFetcher();
  const { data: settings, isLoading: settingLoading } = useSWR<
    PaginatedResponse<Setting>
  >(`/setting?set=${setId}`, authFetcher);

  const exerciseBaseId = settings?.results?.[0]?.exercise_base;
  const { data: exerciseBaseInfo, isLoading: exerciseLoading } =
    useSWR<ExerciseBaseInfo>(
      Number.isInteger(exerciseBaseId) && `/exercisebaseinfo/${exerciseBaseId}`,
      useAuthFetcher(),
    );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setId });
  const [edit, setEdit] = useState(false);

  const isLoading = settingLoading || exerciseLoading;
  const imageUrl = exerciseBaseInfo?.images?.[0]?.image;
  const exercise = exerciseBaseInfo?.exercises.find(
    (exercise) => exercise.language === 2,
  );

  if (isLoading) {
    return null;
  }

  if (!settings || !exercise) {
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
      <ListItem
        dense
        disablePadding
        ref={setNodeRef}
        sx={{ transform: CSS.Transform.toString(transform), transition }}
        secondaryAction={
          edit ? (
            <ExpandLess />
          ) : (
            <IconButton>
              <DragHandle {...attributes} {...listeners} />
            </IconButton>
          )
        }
      >
        <ListItemButton onClick={() => setEdit(!edit)}>
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
            secondary={`${settings.count} sets`}
          />
        </ListItemButton>
      </ListItem>
      <Collapse in={edit} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {settings.results?.map((setting) => (
            <ListItem key={`setting-${setting.id}`} sx={{ pl: 4 }}>
              {setting.reps} {setting.repetition_unit} x {setting.weight}{" "}
              {setting.weight_unit}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};
