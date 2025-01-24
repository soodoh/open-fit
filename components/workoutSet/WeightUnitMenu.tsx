import { editSet } from "@/actions/editSet";
import type { Units } from "@/actions/getUnits";
import type { SetWithUnits } from "@/types/workoutSet";
import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export const WeightUnitMenu = ({
  set,
  units,
}: {
  set: SetWithUnits;
  units: Units;
}) => {
  const [weightUnitMenu, setWeightUnitMenu] = useState<null | HTMLElement>(
    null,
  );
  return (
    <>
      <IconButton
        size="medium"
        edge="end"
        id={`${set.id}-weight-unit-menu-button`}
        aria-controls={
          weightUnitMenu ? `${set.id}-weight-unit-menu` : undefined
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
    </>
  );
};
