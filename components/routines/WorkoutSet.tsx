import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { Setting } from "@/types/privateApi/setting";
import type { PaginatedResponse } from "@/types/response";
import {
  Avatar,
  Collapse,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Add,
  Comment,
  Delete,
  DragHandle,
  Error,
  Image as ImageIcon,
} from "@mui/icons-material";
import { ExerciseBaseInfo } from "@/types/publicApi/exerciseBaseInfo";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { EditSettingRow } from "./EditSettingRow";
import { DeleteSetModal } from "./DeleteSetModal";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";
import { WorkoutSetType } from "@/types/privateApi/set";
import { EditSetCommentModal } from "./EditSetCommentModal";
import { useExercise } from "@/lib/useExercise";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

export const WorkoutSet = ({
  setId,
  isSortingActive,
}: {
  dayId: number;
  setId: number;
  isSortingActive: boolean;
}) => {
  const authFetcher = useAuthFetcher();

  const {
    data: settings,
    isLoading: settingLoading,
    mutate: mutateSettings,
  } = useAuthedSWR<PaginatedResponse<Setting>>(`/setting?set=${setId}`);
  const settingItems = settings?.results ?? [];

  const exerciseBaseId = settings?.results?.[0]?.exercise_base;
  const { data: exerciseBaseInfo, isLoading: exerciseLoading } =
    useAuthedSWR<ExerciseBaseInfo>(
      typeof exerciseBaseId === "number"
        ? `/exercisebaseinfo/${exerciseBaseId}`
        : null,
    );

  const { data: set } = useAuthedSWR<WorkoutSetType>(`/set/${setId}`);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setId });
  const [edit, setEdit] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [deleteOpen, setDelete] = useState(false);
  const defaultWeightUnit = useDefaultWeightUnit();

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const isLoading = settingLoading || exerciseLoading;
  const imageUrl = exerciseBaseInfo?.images?.[0]?.image;
  const exercise = useExercise(exerciseBaseId);

  const handleAdd = async () => {
    const newSet = await authFetcher("/setting/", {
      method: "POST",
      body: JSON.stringify({
        set: setId,
        exercise_base: exerciseBaseId,
        weight: 0,
        weight_unit: defaultWeightUnit,
        reps: 0,
      }),
    });
    const newSettings = settings?.results
      ? [...settings.results, newSet]
      : [newSet];
    mutateSettings({
      ...settings,
      count: newSettings.length,
      results: newSettings,
    });
  };

  const handleSort = async (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (!Number.isInteger(overId) || dragId === overId) {
      return;
    }

    const oldIndex = settingItems.findIndex((setting) => setting.id === dragId);
    const newIndex = settingItems.findIndex((setting) => setting.id === overId);
    const newSettings = arrayMove(settingItems, oldIndex, newIndex);

    const patchUpdates = newSettings.reduce((acc, setting, index) => {
      if (setting.order !== index) {
        acc.push(
          authFetcher(`/setting/${setting.id}`, {
            method: "PATCH",
            body: JSON.stringify({ order: index }),
          }),
        );
      }
      return acc;
    }, [] as Promise<unknown>[]);
    await Promise.all(patchUpdates);
    mutateSettings({ ...settings, results: newSettings });
  };

  if (isLoading) {
    return null;
  }

  const EditActions =
    edit && isSortingActive ? (
      <IconButton
        onClick={() => {
          setDelete(true);
          setEdit(false);
        }}
      >
        <Delete />
      </IconButton>
    ) : (
      <IconButton
        sx={{ touchAction: "manipulation" }}
        {...attributes}
        {...listeners}
      >
        <DragHandle />
      </IconButton>
    );

  return (
    <>
      <DeleteSetModal
        open={deleteOpen}
        onClose={() => setDelete(false)}
        setId={setId}
      />
      <EditSetCommentModal
        open={editComment}
        onClose={() => setEditComment(false)}
        setId={setId}
      />

      <ListItem
        disablePadding
        ref={setNodeRef}
        sx={{ transform: CSS.Transform.toString(transform), transition }}
        secondaryAction={EditActions}
      >
        <ListItemButton onClick={() => setEdit(!edit)}>
          <ListItemAvatar>
            {exercise && imageUrl ? (
              <Avatar alt={`${exercise.name} set item`} src={imageUrl} />
            ) : (
              <Avatar>{exercise ? <ImageIcon /> : <Error />}</Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={exercise?.name ?? "Unknown exercise"}
            secondary={`${settings?.count ?? 0} sets`}
          />
        </ListItemButton>
      </ListItem>

      <Collapse in={edit && isSortingActive} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {set?.comment && (
            <ListItem dense sx={{ pl: 4 }}>
              <ListItemText secondary={set.comment} />
            </ListItem>
          )}

          <DndContext onDragEnd={handleSort} sensors={sensors}>
            <SortableContext
              items={settingItems}
              strategy={verticalListSortingStrategy}
            >
              {settingItems.map((setting) => (
                <EditSettingRow
                  key={`setting-${setting.id}`}
                  settingId={setting.id}
                />
              ))}
            </SortableContext>
          </DndContext>

          <ListItem sx={{ display: "flex", gap: 2 }}>
            <Fab size="medium" variant="extended" onClick={handleAdd}>
              <Add />
              New set
            </Fab>
            <Fab
              size="medium"
              variant="extended"
              onClick={() => setEditComment(true)}
            >
              <Comment />
            </Fab>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};
