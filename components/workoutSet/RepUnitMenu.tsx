import type { Units } from "@/actions/getUnits";
import { ArrowDropDown } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import type { RepetitionUnit } from "@prisma/client";
import { useState } from "react";

export const RepUnitMenu = ({
  id,
  onChange,
  units,
}: {
  id: string | number;
  onChange: (repUnit: RepetitionUnit) => void;
  units: Units;
}) => {
  const [repUnitMenu, setRepUnitMenu] = useState<null | HTMLElement>(null);
  return (
    <>
      <IconButton
        size="medium"
        edge="end"
        id={`${id}-rep-unit-menu-button`}
        aria-controls={repUnitMenu ? `${id}-rep-unit-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={repUnitMenu ? "true" : undefined}
        onClick={(event) => setRepUnitMenu(event.currentTarget)}
      >
        <ArrowDropDown fontSize="small" />
      </IconButton>
      <Menu
        id={`${id}-rep-unit-menu`}
        anchorEl={repUnitMenu}
        open={!!repUnitMenu}
        onClose={() => setRepUnitMenu(null)}
        MenuListProps={{
          "aria-labelledby": `${id}-rep-unit-menu-button`,
        }}
      >
        {units.repetitionUnits.map((unit) => (
          <MenuItem
            key={`rep-unit-${id}-${unit.id}`}
            onClick={() => {
              onChange(unit);
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
