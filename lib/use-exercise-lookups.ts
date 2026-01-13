"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import type { Doc, Id } from "@/convex/_generated/dataModel";

type Equipment = Doc<"equipment">;
type MuscleGroup = Doc<"muscleGroups">;
type Category = Doc<"categories">;

export function useExerciseLookups() {
  const equipment = useQuery(api.queries.lookups.getEquipment) as
    | Equipment[]
    | undefined;
  const muscleGroups = useQuery(api.queries.lookups.getMuscleGroups) as
    | MuscleGroup[]
    | undefined;
  const categories = useQuery(api.queries.lookups.getCategories) as
    | Category[]
    | undefined;

  const isLoading = !equipment || !muscleGroups || !categories;

  const equipmentMap = useMemo(() => {
    if (!equipment) return new Map<Id<"equipment">, string>();
    return new Map(equipment.map((e: Equipment) => [e._id, e.name] as const));
  }, [equipment]);

  const muscleGroupMap = useMemo(() => {
    if (!muscleGroups) return new Map<Id<"muscleGroups">, string>();
    return new Map(
      muscleGroups.map((m: MuscleGroup) => [m._id, m.name] as const),
    );
  }, [muscleGroups]);

  const categoryMap = useMemo(() => {
    if (!categories) return new Map<Id<"categories">, string>();
    return new Map(categories.map((c: Category) => [c._id, c.name] as const));
  }, [categories]);

  const getEquipmentName = (
    id: Id<"equipment"> | undefined,
  ): string | undefined => {
    if (!id) return undefined;
    return equipmentMap.get(id);
  };

  const getMuscleGroupName = (id: Id<"muscleGroups">): string => {
    return muscleGroupMap.get(id) ?? "";
  };

  const getMuscleGroupNames = (ids: Id<"muscleGroups">[]): string[] => {
    return ids.map((id) => muscleGroupMap.get(id) ?? "").filter(Boolean);
  };

  const getCategoryName = (id: Id<"categories">): string => {
    return categoryMap.get(id) ?? "";
  };

  return {
    equipment,
    muscleGroups,
    categories,
    isLoading,
    getEquipmentName,
    getMuscleGroupName,
    getMuscleGroupNames,
    getCategoryName,
  };
}
