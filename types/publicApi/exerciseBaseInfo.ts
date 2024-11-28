import { ExerciseCategory } from "./exerciseCategory";
import { Equipment } from "./equipment";
import { Exercise } from "./exercise";
import { ExerciseAlias } from "./exerciseAlias";
import { License } from "./license";

type ExtendedExercise = Exercise & {
  aliases: ExerciseAlias[];
  license_author_url: string;
  license_derivative_source_url: string;
  license_object_url: string;
  license_title: string;
  notes: string[];
};

export type ExerciseBaseInfo = {
  author_history: string[];
  category: ExerciseCategory;
  created: string;
  equipment: Equipment[];
  exercises: ExtendedExercise[];
  id: number;
  images: string[];
  last_update: string;
  last_update_global: string;
  license: License;
  license_author: string;
  muscles: string[];
  muscles_secondary: string[];
  total_authors_history: string[];
  uuid: string;
  variations: null;
  videos: string[];
};
