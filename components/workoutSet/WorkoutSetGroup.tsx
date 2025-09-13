import { type Units } from "@/actions/getUnits";
import { SetType } from "@/prisma/generated/client";
import { ListView } from "@/types/constants";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Add,
  DragHandle,
  Error,
  Image as ImageIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Collapse,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { EditSetGroupMenu } from "./EditSetGroupMenu";
import { WorkoutSetRow } from "./WorkoutSetRow";
import type {
  SetGroupWithRelations,
  SetWithNumber,
  SetWithRelations,
} from "@/types/workoutSet";

export const WorkoutSetGroup = ({
  view,
  setGroup,
  isReorderActive,
  units,
  startRestTimer,
}: {
  view: ListView;
  setGroup: SetGroupWithRelations;
  isReorderActive: boolean;
  units: Units;
  startRestTimer: (seconds: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: setGroup.id });
  const [, startTransition] = useTransition();
  const [sets, optimisticUpdateSets] = useOptimistic<
    SetWithRelations[],
    SetWithRelations[]
  >(setGroup.sets, (_, newSets) => newSets);
  const [expanded, setExpanded] = useState(
    view === ListView.CurrentSession && sets.some((set) => !set.completed),
  );
  const [canReorderSets, setReorderSets] = useState(false);

  useEffect(() => {
    if (sets.every((set) => set.completed)) {
      setExpanded(false);
    }
  }, [sets]);

  const exercise = sets[0]?.exercise;
  const setsWithNumber = useMemo(() => {
    let setNum = 1;
    return sets.reduce((acc, set) => {
      acc.push({ set, setNum });
      if (set.type === SetType.NORMAL) {
        setNum += 1;
      }
      return acc;
    }, [] as SetWithNumber[]);
  }, [sets]);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const handleAdd = async () => {
    await fetch("/api/set", {
      method: "POST",
      body: JSON.stringify({
        setGroupId: setGroup.id,
        exerciseId: exercise.id,
      }),
    });
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
      await fetch("/api/set/reorder", {
        method: "POST",
        body: JSON.stringify({ setIds: newSets.map(({ id }) => id) }),
      });
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
              view={view}
              setGroup={setGroup}
              reorder={canReorderSets}
              onReorder={() => setReorderSets(!canReorderSets)}
              units={units}
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
            primary={
              <Typography
                sx={
                  setGroup.sets.every((set) => set.completed)
                    ? { textDecoration: "line-through" }
                    : {}
                }
              >
                {exercise?.name ?? "Unknown exercise"}
              </Typography>
            }
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
                    key={`set-row-${set.id}`}
                    view={view}
                    set={set}
                    setNum={setNum}
                    units={units}
                    reorder={canReorderSets}
                    startRestTimer={startRestTimer}
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
