import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type RoutineDayWithRoutine = Doc<"routineDays"> & {
  routine: Doc<"routines"> | null;
};

export const SelectTemplate = ({
  value,
  onChange,
  disabled,
  label,
}: {
  value: RoutineDayWithRoutine | null;
  onChange: (newValue: RoutineDayWithRoutine | null) => void;
  disabled: boolean;
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const options = useQuery(api.queries.routineDays.search, { searchTerm });
  const isLoading = options === undefined;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {value?.description ?? "Empty workout"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search workouts..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : options?.length === 0 ? (
                <CommandEmpty>No workouts found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {options?.map((option) => (
                    <CommandItem
                      key={option._id}
                      value={option.description}
                      onSelect={() => {
                        onChange(option._id === value?._id ? null : option);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value?._id === option._id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{option.description}</span>
                        {option.routine?.name && (
                          <span className="text-sm text-muted-foreground">
                            {option.routine.name}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
