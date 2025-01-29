import { editSet } from "@/actions/editSet";
import { SetWithRelations } from "@/types/workoutSet";
import {
  Avatar,
  IconButton,
  ListItemAvatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { SetType } from "@prisma/client";
import { type ReactNode, useState } from "react";
import { red, yellow } from "@mui/material/colors";
import { Whatshot } from "@mui/icons-material";

// TODO do this better, with localization, etc.
const setTypes: Record<SetType, { label: string }> = {
  [SetType.WARMUP]: {
    label: "Warmup",
  },
  [SetType.NORMAL]: {
    label: "Normal",
  },
  [SetType.DROPSET]: {
    label: "Dropset",
  },
  // TODO consider replacing this with RiR (reps in reserve)
  [SetType.FAILURE]: {
    label: "Failure",
  },
};

const setTypeIcons: Partial<Record<SetType, ReactNode>> = {
  [SetType.WARMUP]: (
    <Avatar sx={{ bgcolor: yellow[700], width: 32, height: 32 }}>
      <Whatshot />
    </Avatar>
  ),
  [SetType.DROPSET]: <Avatar sx={{ width: 32, height: 32 }}>D</Avatar>,
  [SetType.FAILURE]: (
    <Avatar sx={{ bgcolor: red[900], width: 32, height: 32 }}>F</Avatar>
  ),
};

export const SetTypeMenu = ({
  set,
  setNum,
}: {
  set: SetWithRelations;
  setNum: number;
}) => {
  const [setTypeMenu, setSetTypeMenu] = useState<null | HTMLElement>(null);
  return (
    <>
      <ListItemAvatar>
        <IconButton
          id={`${set.id}-set-type-menu-button`}
          aria-controls={setTypeMenu ? `${set.id}-set-type-menu` : undefined}
          aria-haspopup="true"
          aria-expanded={setTypeMenu ? "true" : undefined}
          onClick={(event) => setSetTypeMenu(event.currentTarget)}
        >
          {setTypeIcons[set.type] ?? (
            <Avatar sx={{ width: 32, height: 32 }}>{setNum}</Avatar>
          )}
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
            {setTypes[setType].label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
