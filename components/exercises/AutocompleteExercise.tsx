import { searchExercise } from "@/actions/searchExercise";
import { Image as ImageIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import type { Exercise } from "@/prisma/generated/client";

export const AutocompleteExercise = ({
  value,
  onChange,
}: {
  value: Exercise | null;
  onChange: (exercise: Exercise | null) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: options, isLoading } = useSWR(searchTerm, searchExercise, {
    keepPreviousData: true,
  });

  return (
    <Autocomplete
      autoComplete
      fullWidth
      value={value}
      inputValue={searchTerm}
      options={options ?? []}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      getOptionLabel={(option) => option?.name ?? "Unknown"}
      getOptionKey={(option) => `exercise-${option?.id}`}
      filterOptions={(option) => option}
      loading={isLoading}
      noOptionsText="No exercises found"
      onChange={(_, selectedExercise) => {
        onChange(selectedExercise);
      }}
      onInputChange={(_, newInputValue: string) => {
        setSearchTerm(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Add an exercise"
          placeholder="Start typing to search for exercises"
        />
      )}
      renderOption={({ key, ...optionProps }, option) => {
        return (
          <ListItem key={key} {...optionProps}>
            <ListItemAvatar>
              {option.images[0] ? (
                <Avatar
                  alt={`${option.name} thumbnail`}
                  src={`/exercises/${option.images[0]}`}
                />
              ) : (
                <Avatar>
                  <ImageIcon />
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText
              primary={option.name}
              secondary={option.primaryMuscles.join(", ")}
            />
          </ListItem>
        );
      }}
    />
  );
};
