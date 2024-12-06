export type ExerciseSearchData = {
  id: number;
  base_id: number;
  name: string;
  category: string | null;
  image: string | null;
  image_thumbnail: string | null;
};

export type ExerciseSearchResult = {
  value: string;
  data: ExerciseSearchData;
};

export type ExerciseSearchResults = {
  suggestions?: ExerciseSearchResult[];
};
