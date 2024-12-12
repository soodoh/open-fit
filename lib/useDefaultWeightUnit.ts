import useSWR from "swr";
import { fetcher, useAuthedSWR } from "./fetcher";
import { UserProfile } from "@/types/privateApi/userProfile";
import { PaginatedResponse } from "@/types/response";
import { WeightUnit } from "@/types/publicApi/weightUnit";

export function useDefaultWeightUnit() {
  const { data: weightUnits } = useSWR<PaginatedResponse<WeightUnit>>(
    "/setting-weightunit?ordering=id",
    fetcher,
  );
  const { data: userProfile } = useAuthedSWR<UserProfile>(`/userprofile/`);

  return (
    weightUnits?.results?.find(
      (weightUnit) => weightUnit.name === userProfile?.weight_unit,
    )?.id ?? 2
  );
}
