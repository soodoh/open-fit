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
import { getSet, getSetting, getSettings, SETTING } from "@/lib/urls";
import { useSWRConfig } from "swr";

export const WorkoutSet = ({
  setId,
  isSortingActive,
}: {
  setId?: number;
  isSortingActive: boolean;
}) => {
  const authFetcher = useAuthFetcher();

  const { mutate } = useSWRConfig();
  const { data: settings, isLoading: settingLoading } = useAuthedSWR<
    PaginatedResponse<Setting>
  >(getSettings(setId));

  const exerciseBaseId = settings?.results?.[0]?.exercise_base;

  const { data: set } = useAuthedSWR<WorkoutSetType>(getSet(setId));

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setId ?? -1 });
  const [edit, setEdit] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [deleteOpen, setDelete] = useState(false);
  const defaultWeightUnit = useDefaultWeightUnit();

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const { exercise, imageUrl } = useExercise(exerciseBaseId);
  const isLoading = settingLoading || !exercise;

  const handleAdd = async () => {
    const settingPromise = authFetcher(SETTING, {
      method: "POST",
      body: JSON.stringify({
        set: setId,
        exercise_base: exerciseBaseId,
        weight: 0,
        weight_unit: defaultWeightUnit,
        reps: 0,
      }),
    });
    mutate(getSettings(setId), settingPromise, {
      populateCache: (newSetting: Setting, cachedSettings) => {
        const newResults = cachedSettings?.results
          ? [...cachedSettings.results, newSetting]
          : [newSetting];
        return {
          ...cachedSettings,
          count: newResults.length,
          results: newResults,
        };
      },
      revalidate: false,
      rollbackOnError: true,
    });
  };

  const handleSort = async (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (!Number.isInteger(overId) || dragId === overId || !settings?.results) {
      return;
    }

    const oldIndex = settings.results.findIndex(
      (setting) => setting.id === dragId,
    );
    const newIndex = settings.results.findIndex(
      (setting) => setting.id === overId,
    );
    const newSettings = arrayMove(settings.results, oldIndex, newIndex);

    const settingPromises = Promise.all(
      newSettings.reduce((acc, setting, index) => {
        if (setting.order !== index) {
          acc.push(
            authFetcher(getSetting(setting.id), {
              method: "PATCH",
              body: JSON.stringify({ order: index }),
            }),
          );
        }
        return acc;
      }, [] as Promise<unknown>[]),
    );
    mutate(getSettings(setId), settingPromises, {
      populateCache: false,
      optimisticData: {
        ...settings,
        results: newSettings,
      },
      revalidate: false,
      rollbackOnError: true,
    });
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
              items={settings?.results ?? []}
              strategy={verticalListSortingStrategy}
            >
              {settings?.results?.map((setting) => (
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
