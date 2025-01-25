import type { Units } from "@/actions/getUnits";
import { ArrowDropDown } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import type { WeightUnit } from "@prisma/client";

export const WeightUnitMenu = ({
  id,
  onChange,
  units,
}: {
  id: string | number;
  onChange: (weightUnit: WeightUnit) => void;
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
        id={`${id}-weight-unit-menu-button`}
        aria-controls={weightUnitMenu ? `${id}-weight-unit-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={weightUnitMenu ? "true" : undefined}
        onClick={(event) => setWeightUnitMenu(event.currentTarget)}
      >
        <ArrowDropDown fontSize="small" />
      </IconButton>
      <Menu
        id={`${id}-weight-unit-menu`}
        anchorEl={weightUnitMenu}
        open={!!weightUnitMenu}
        onClose={() => setWeightUnitMenu(null)}
        MenuListProps={{
          "aria-labelledby": `${id}-weight-unit-menu-button`,
        }}
      >
        {units.weightUnits.map((unit) => (
          <MenuItem
            key={`weight-unit-${id}-${unit.id}`}
            onClick={() => {
              onChange(unit);
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
