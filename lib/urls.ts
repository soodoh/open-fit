export const WORKOUTS = "/workout/";
export const SETTING = "/setting/";
export const SET = "/set/";
export const DAY = "/day/";

// Public
export const DAYS_OF_WEEK = `/daysofweek/`;
export const REPETITION_UNITS = "/setting-repetitionunit?ordering=id";
export const WEIGHT_UNITS = "/setting-weightunit?ordering=id";

const isValidId = (id?: number) => typeof id === "number";

export const getWorkout = (workoutId?: number) =>
  isValidId(workoutId) ? `/workout/${workoutId}` : null;

export const getDays = (workoutId?: number) =>
  isValidId(workoutId) ? `/day?training=${workoutId}` : null;

export const getDay = (dayId?: number) =>
  isValidId(dayId) ? `/day/${dayId}` : null;

export const getSets = (dayId?: number) =>
  isValidId(dayId) ? `/set?exerciseday=${dayId}` : null;

export const getSet = (setId?: number) =>
  isValidId(setId) ? `/set/${setId}` : null;

export const getSettings = (setId?: number) =>
  isValidId(setId) ? `/setting?set=${setId}` : null;

export const getSetting = (settingId?: number) =>
  isValidId(settingId) ? `/setting/${settingId}` : null;
