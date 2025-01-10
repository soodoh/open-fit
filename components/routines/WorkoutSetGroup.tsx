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
import { WorkoutSetRow } from "./WorkoutSetRow";
import { DeleteSetGroupModal } from "./DeleteSetModal";
import { EditSetCommentModal } from "./EditSetCommentModal";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { revalidatePath } from "next/cache";
import { reorderSets } from "@/actions/reorderSets";
import { SetGroupWithSets } from "@/types/routineDay";
import useSWR from "swr";
import { getUnits, Units } from "@/actions/getUnits";

export const WorkoutSetGroup = ({
  setGroup,
  isSortingActive,
}: {
  setGroup: SetGroupWithSets;
  isSortingActive: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setGroup.id });
  const [edit, setEdit] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [deleteOpen, setDelete] = useState(false);
  const { data: units } = useSWR<Units>("units", () => getUnits());

  const exercise = setGroup.sets[0]?.exercise;

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleAdd = async () => {};

  const handleSort = async (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (!Number.isInteger(overId) || dragId === overId) {
      return;
    }

    const oldIndex = setGroup.sets.findIndex((set) => set.id === dragId);
    const newIndex = setGroup.sets.findIndex((set) => set.id === overId);
    const newSettings = arrayMove(setGroup.sets, oldIndex, newIndex);
    await reorderSets(newSettings);
    revalidatePath(`/day/${setGroup.routineDayId}`);
  };

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
      <DeleteSetGroupModal
        open={deleteOpen}
        onClose={() => setDelete(false)}
        setGroup={setGroup}
      />
      <EditSetCommentModal
        open={editComment}
        onClose={() => setEditComment(false)}
        setGroup={setGroup}
      />

      <ListItem
        disablePadding
        ref={setNodeRef}
        sx={{ transform: CSS.Transform.toString(transform), transition }}
        secondaryAction={EditActions}
      >
        <ListItemButton onClick={() => setEdit(!edit)}>
          <ListItemAvatar>
            {exercise ? (
              <Avatar
                alt={`${exercise.name} set item`}
                src={exercise.images[0]}
              />
            ) : (
              <Avatar>{exercise ? <ImageIcon /> : <Error />}</Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={exercise.name}
            secondary={`${setGroup.sets.length} sets`}
          />
        </ListItemButton>
      </ListItem>

      <Collapse in={edit && isSortingActive} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {setGroup.comment && (
            <ListItem dense sx={{ pl: 4 }}>
              <ListItemText secondary={setGroup.comment} />
            </ListItem>
          )}

          <DndContext onDragEnd={handleSort} sensors={sensors}>
            <SortableContext
              items={setGroup.sets}
              strategy={verticalListSortingStrategy}
            >
              {setGroup.sets.map(
                (set) =>
                  units && (
                    <WorkoutSetRow
                      key={`set-${set.id}`}
                      set={set}
                      units={units}
                    />
                  ),
              )}
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
