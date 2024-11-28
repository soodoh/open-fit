import { License } from "./license";
import { Ingredient } from "./ingredient";
import { Language } from "./language";

export type IngredientInfo = Omit<Ingredient, "language" | "license"> & {
  language: Language;
  license: License;
  weight_units: string[];
};
