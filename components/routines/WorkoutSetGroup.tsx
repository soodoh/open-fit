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
import { useOptimistic, useState, useTransition } from "react";
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
import { reorderSets } from "@/actions/reorderSets";
import { type Units } from "@/actions/getUnits";
import type { SetGroupWithSets, SetWithUnits } from "@/types/workoutSet";
import { createSet } from "@/actions/createSet";

export const WorkoutSetGroup = ({
  setGroup,
  isSortingActive,
  units,
}: {
  setGroup: SetGroupWithSets;
  isSortingActive: boolean;
  units: Units;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setGroup.id });
  const [edit, setEdit] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [deleteOpen, setDelete] = useState(false);
  const [, startTransition] = useTransition();
  const [sets, optimisticUpdateSets] = useOptimistic<
    SetWithUnits[],
    SetWithUnits[]
  >(setGroup.sets, (_, newSets) => newSets);

  const exercise = sets[0]?.exercise;

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleAdd = async () => {
    await createSet(setGroup.id, exercise.id);
  };

  const handleSort = (event: DragEndEvent) => {
    const dragId = event.active.id;
    const overId = event.over?.id;
    if (!Number.isInteger(overId) || dragId === overId) {
      return;
    }

    const oldIndex = sets.findIndex((set) => set.id === dragId);
    const newIndex = sets.findIndex((set) => set.id === overId);
    const newSets = arrayMove(sets, oldIndex, newIndex);
    startTransition(async () => {
      optimisticUpdateSets(newSets);
      await reorderSets(newSets);
    });
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
                src={`/exercises/${exercise.images[0]}`}
              />
            ) : (
              <Avatar>{exercise ? <ImageIcon /> : <Error />}</Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={exercise?.name ?? "Unknown exercise"}
            secondary={`${sets.length} sets`}
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

          <DndContext id="sets" onDragEnd={handleSort} sensors={sensors}>
            <SortableContext
              items={sets}
              strategy={verticalListSortingStrategy}
            >
              {sets.map((set) => (
                <WorkoutSetRow key={`set-${set.id}`} set={set} units={units} />
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
