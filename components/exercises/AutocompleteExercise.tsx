import { useAuthFetcher } from "@/lib/fetcher";
import type {
  ExerciseSearchData,
  ExerciseSearchResults,
} from "@/types/privateApi/exerciseSearch";
import { Image as ImageIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import useSWR from "swr";

export const AutocompleteExercise = () => {
  const authFetcher = useAuthFetcher();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults, isLoading } = useSWR<ExerciseSearchResults>(
    searchTerm ? `/exercise/search?language=${2}&term=${searchTerm}` : null,
    authFetcher,
  );
  const options = useMemo(() => {
    const duplicates = new Set();
    return (
      searchResults?.suggestions?.reduce((newResults, result) => {
        if (!result || duplicates.has(result.data.id)) {
          return newResults;
        }
        duplicates.add(result.data.id);
        newResults.push(result.data);
        return newResults;
      }, [] as ExerciseSearchData[]) ?? []
    );
  }, [searchResults?.suggestions]);

  return (
    <Autocomplete
      autoComplete
      fullWidth
      options={options}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      getOptionLabel={(option) => option?.name ?? "Unknown"}
      getOptionKey={(option) => `exercise-${option?.id}`}
      filterOptions={(option) => option}
      loading={isLoading}
      noOptionsText="No exercises found"
      onChange={(_, value) => {
        console.log("change", value);
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
              {option.image_thumbnail ? (
                <Avatar
                  alt={`${option.name} thumbnail`}
                  src={`https://wger.pauld.link${option.image_thumbnail}`}
                />
              ) : (
                <Avatar>
                  <ImageIcon />
                </Avatar>
              )}
            </ListItemAvatar>
            <ListItemText primary={option.name} secondary={option.category} />
          </ListItem>
        );
      }}
    />
  );
};
