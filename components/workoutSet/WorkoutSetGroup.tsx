import {
  Avatar,
  Collapse,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Add,
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
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { WorkoutSetRow } from "./WorkoutSetRow";
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
import { EditSetGroupMenu } from "./EditSetGroupMenu";
import { SetType } from "@prisma/client";

export const WorkoutSetGroup = ({
  setGroup,
  isReorderActive,
  units,
}: {
  setGroup: SetGroupWithSets;
  isReorderActive: boolean;
  units: Units;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setGroup.id });
  const [, startTransition] = useTransition();
  const [sets, optimisticUpdateSets] = useOptimistic<
    SetWithUnits[],
    SetWithUnits[]
  >(setGroup.sets, (_, newSets) => newSets);
  const [expanded, setExpanded] = useState(false);
  const [canReorderSets, setReorderSets] = useState(false);

  const exercise = sets[0]?.exercise;
  const setsWithNumber: { set: SetWithUnits; setNum: number }[] =
    useMemo(() => {
      let setNum = 1;
      return sets.reduce((acc, set) => {
        acc.push({ set, setNum });
        if (set.type === SetType.NORMAL) {
          setNum += 1;
        }
        return acc;
      }, []);
    }, [sets]);

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

  return (
    <>
      <ListItem
        disablePadding
        ref={setNodeRef}
        sx={{ transform: CSS.Transform.toString(transform), transition }}
        secondaryAction={
          !isReorderActive && (
            <EditSetGroupMenu
              setGroup={setGroup}
              reorder={canReorderSets}
              onReorder={() => setReorderSets(!canReorderSets)}
            />
          )
        }
      >
        <ListItemButton onClick={() => setExpanded(!expanded)}>
          {isReorderActive && (
            <ListItemIcon>
              <IconButton
                sx={{ touchAction: "manipulation" }}
                {...attributes}
                {...listeners}
              >
                <DragHandle />
              </IconButton>
            </ListItemIcon>
          )}

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

      <Collapse in={!isReorderActive && expanded} timeout="auto" unmountOnExit>
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
              {setsWithNumber.map(({ set, setNum }) => {
                return (
                  <WorkoutSetRow
                    key={`set-${set.id}`}
                    set={set}
                    setNum={setNum}
                    units={units}
                    reorder={canReorderSets}
                  />
                );
              })}
            </SortableContext>
          </DndContext>

          <ListItem sx={{ display: "flex", gap: 2 }}>
            <Fab size="medium" variant="extended" onClick={handleAdd}>
              <Add />
              New set
            </Fab>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};
