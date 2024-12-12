import { ExerciseBaseInfo } from "@/types/publicApi/exerciseBaseInfo";
import { Exercise } from "@/types/publicApi/exercise";
import useSWR from "swr";
import { fetcher } from "./fetcher";

export function useExercise(exerciseBaseId?: number): Exercise | null {
  const { data: exerciseBaseInfo } = useSWR<ExerciseBaseInfo>(
    typeof exerciseBaseId === "number"
      ? `/exercisebaseinfo/${exerciseBaseId}`
      : null,
    fetcher,
  );
  // TODO support other languages
  const exercise = exerciseBaseInfo?.exercises?.find(
    (exercise) => exercise.language === 2,
  );

  return exercise ?? null;
}
