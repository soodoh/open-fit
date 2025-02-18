import {
  RoutineDayWithRoutine,
  searchTemplates,
} from "@/actions/searchTemplates";
import { Autocomplete, ListItem, ListItemText, TextField } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

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
  const [searchTerm, setSearchTerm] = useState("");
  const { data: options, isLoading } = useSWR(
    { searchTerm },
    ({ searchTerm }) => searchTemplates(searchTerm),
    {
      keepPreviousData: true,
      fallbackData: value ? [value] : [],
    },
  );

  return (
    <Autocomplete
      fullWidth
      value={value ?? null}
      inputValue={searchTerm}
      options={options}
      autoHighlight
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      getOptionLabel={(option) => option?.description ?? "Unknown"}
      getOptionKey={(option) => `template-${option?.id}`}
      filterOptions={(option) => option}
      loading={isLoading}
      noOptionsText="No workouts found"
      onChange={(_, selectedTemplate) => {
        onChange(selectedTemplate);
      }}
      onInputChange={(_, newInputValue: string) => {
        setSearchTerm(newInputValue);
      }}
      disabled={disabled}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Empty workout" />
      )}
      renderOption={({ key, ...optionProps }, option) => {
        return (
          <ListItem key={key} {...optionProps}>
            <ListItemText
              primary={option?.description}
              secondary={option?.routine?.name}
            />
          </ListItem>
        );
      }}
    />
  );
};
