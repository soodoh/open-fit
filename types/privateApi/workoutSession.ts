export enum Impression {
  BAD = 1,
  NEUTRAL = 2,
  GOOD = 3,
}

export type WorkoutSession = {
  id: number;
  user: number;
  workout: number;
  date: string;
  notes: string;
  impression: `${Impression}`;
  time_start: string;
  time_end: string;
};
