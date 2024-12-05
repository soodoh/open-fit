export type ExerciseResult = {
  value: string;
  data: {
    id: number;
    base_id: number;
    name: string;
    category: string | null;
    image: string | null;
    image_thumbnail: string | null;
  };
};

export type ExerciseSearchResults = {
  suggestions?: ExerciseResult[];
};
