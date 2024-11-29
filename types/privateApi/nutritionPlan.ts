export type NutritionPlan = {
  id: number;
  creation_date: string;
  description: string;
  only_logging: boolean;
  goal_energy: number;
  goal_protein: number;
  goal_carbohydrates: number;
  goal_fat: number;
  goal_fiber: number;
};

