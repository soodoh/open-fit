import { editSet } from "@/actions/editSet";
import type { Units } from "@/actions/getUnits";
import type { SetWithUnits } from "@/types/workoutSet";
import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export const RepUnitMenu = ({
  set,
  units,
}: {
  set: SetWithUnits;
  units: Units;
}) => {
  const [repUnitMenu, setRepUnitMenu] = useState<null | HTMLElement>(null);
  return (
    <>
      <IconButton
        size="medium"
        edge="end"
        id={`${set.id}-rep-unit-menu-button`}
        aria-controls={repUnitMenu ? `${set.id}-rep-unit-menu` : undefined}
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
    </>
  );
};

