import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import type { Units } from "@/actions/getUnits";
import type { WeightUnit } from "@/prisma/generated/client";

export const WeightUnitMenu = ({
  id,
  onChange,
  units,
}: {
  id: string | number;
  onChange: (weightUnit: WeightUnit) => void;
  units: Units;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {units.weightUnits.map((unit) => (
          <DropdownMenuItem
            key={`weight-unit-${id}-${unit.id}`}
            onClick={() => {
              onChange(unit);
              setOpen(false);
            }}
          >
            {unit.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
