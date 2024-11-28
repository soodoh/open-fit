export type Exercise = {
  id: number;
  uuid: string;
  name: string;
  exercise_base: number;
  description: string;
  created: string; // Datetime
  category: number;
  muscles: number[];
  muscles_secondary: number[];
  equipment: number[];
  language: number;
  license: number;
  license_author: string;
  variations: number[];
  author_history: string[];
};
