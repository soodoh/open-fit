import { deleteSet } from "@/actions/deleteSet";
import { editSet } from "@/actions/editSet";
import type { Units } from "@/actions/getUnits";
import type { SetWithUnits } from "@/types/workoutSet";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Delete, DragHandle, MoreVert } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { SetType } from "@prisma/client";

export const WorkoutSetRow = ({
  set,
  units,
}: {
  set: SetWithUnits;
  units: Units;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: set.id });
  const [repUnitMenu, setRepUnitMenu] = useState<null | HTMLElement>(null);
  const [weightUnitMenu, setWeightUnitMenu] = useState<null | HTMLElement>(
    null,
  );
  const [setTypeMenu, setSetTypeMenu] = useState<null | HTMLElement>(null);

  return (
    <ListItem
      dense
      disablePadding
      ref={setNodeRef}
      sx={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <ListItemIcon>
        <IconButton
          sx={{ mx: 2, touchAction: "manipulation" }}
          {...attributes}
          {...listeners}
        >
          <DragHandle />
        </IconButton>
      </ListItemIcon>

      <ListItemAvatar
        id={`${set.id}-set-type-menu-button`}
        aria-controls={setTypeMenu ? `${set.id}-set-type-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={setTypeMenu ? "true" : undefined}
        onClick={(event) => setSetTypeMenu(event.currentTarget)}
      >
        <IconButton onClick={(event) => setSetTypeMenu(event.currentTarget)}>
          <Avatar>{set.type?.[0] ?? set.order}</Avatar>
        </IconButton>
      </ListItemAvatar>
      <Menu
        id={`${set.id}-set-type-menu`}
        anchorEl={setTypeMenu}
        open={!!setTypeMenu}
        onClose={() => setSetTypeMenu(null)}
        MenuListProps={{
          "aria-labelledby": `${set.id}-set-type-menu-button`,
        }}
      >
        {Object.values(SetType).map((setType) => (
          <MenuItem
            key={`set-type-${set.id}-${setType}`}
            onClick={async () => {
              await editSet({
                id: set.id,
                type: setType,
              });
              setSetTypeMenu(null);
            }}
          >
            {setType}
          </MenuItem>
        ))}
      </Menu>

      <Box sx={{ display: "flex", gap: 2, my: 1 }}>
        <TextField
          size="small"
          variant="outlined"
          type="string"
          label={set.repetitionUnit.name}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="medium"
                    edge="end"
                    id={`${set.id}-rep-unit-menu-button`}
                    aria-controls={
                      repUnitMenu ? `${set.id}-rep-unit-menu` : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={repUnitMenu ? "true" : undefined}
                    onClick={(event) => setRepUnitMenu(event.currentTarget)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                  <Menu
                    id={`${set.id}-rep-unit-menu`}
                    anchorEl={repUnitMenu}
                    open={!!repUnitMenu}
                    onClose={() => setRepUnitMenu(null)}
                    MenuListProps={{
                      "aria-labelledby": `${set.id}-rep-unit-menu-button`,
                    }}
                  >
                    {units.repetitionUnits.map((unit) => (
                      <MenuItem
                        key={`rep-unit-${set.id}-${unit.id}`}
                        onClick={async () => {
                          await editSet({
                            id: set.id,
                            repetitionUnitId: unit.id,
                          });
                          setRepUnitMenu(null);
                        }}
                      >
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </InputAdornment>
              ),
            },
          }}
          defaultValue={set.reps}
          onBlur={async (event) => {
            await editSet({
              id: set.id,
              reps: parseInt(event.target.value, 10) || 0,
            });
          }}
        />

        <TextField
          size="small"
          variant="outlined"
          type="string"
          label={set.weightUnit.name}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="medium"
                    edge="end"
                    id={`${set.id}-weight-unit-menu-button`}
                    aria-controls={
                      repUnitMenu ? `${set.id}-weight-unit-menu` : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={weightUnitMenu ? "true" : undefined}
                    onClick={(event) => setWeightUnitMenu(event.currentTarget)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                  <Menu
                    id={`${set.id}-weight-unit-menu`}
                    anchorEl={weightUnitMenu}
                    open={!!weightUnitMenu}
                    onClose={() => setWeightUnitMenu(null)}
                    MenuListProps={{
                      "aria-labelledby": `${set.id}-weight-unit-menu-button`,
                    }}
                  >
                    {units.weightUnits.map((unit) => (
                      <MenuItem
                        key={`weight-unit-${set.id}-${unit.id}`}
                        onClick={async () => {
                          await editSet({
                            id: set.id,
                            weightUnitId: unit.id,
                          });
                          setWeightUnitMenu(null);
                        }}
                      >
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </InputAdornment>
              ),
            },
          }}
          defaultValue={set.weight}
          onBlur={async (event) => {
            await editSet({
              id: set.id,
              weight: parseInt(event.target.value, 10) || 0,
            });
          }}
        />
      </Box>

      <ListItemIcon>
        <IconButton onClick={() => deleteSet(set.id)}>
          <Delete />
        </IconButton>
      </ListItemIcon>
    </ListItem>
  );
};
