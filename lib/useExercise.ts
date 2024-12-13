import { ExerciseBaseInfo } from "@/types/publicApi/exerciseBaseInfo";
import { Exercise } from "@/types/publicApi/exercise";
import useSWR from "swr";
import { fetcher } from "./fetcher";

type ExerciseMap = {
  exercise: Exercise | null;
  imageUrl: string | null;
};

export function useExercise(exerciseBaseId?: number): ExerciseMap {
  const { data: exerciseBaseInfo } = useSWR<ExerciseBaseInfo>(
    typeof exerciseBaseId === "number"
      ? `/exercisebaseinfo/${exerciseBaseId}`
      : null,
    fetcher,
  );
  // TODO support other languages
  const exercise =
    exerciseBaseInfo?.exercises?.find((exercise) => exercise.language === 2) ??
    null;
  const imageUrl = exerciseBaseInfo?.images?.[0]?.image ?? null;

  return { exercise, imageUrl };
}
