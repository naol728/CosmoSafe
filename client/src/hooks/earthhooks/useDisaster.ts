import { getDisaster } from "@/services/earthService";
import { useQuery } from "@tanstack/react-query";
import type { Params } from "./type";

export function useDisaster({ page, search, location, limit }: Params) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["disaster", page, search, location],
    queryFn: () =>
      getDisaster({
        page,
        limit,
        search,
        lat: location?.lat ?? 9.03,
        lon: location?.lon ?? 38.74,
      }),
    enabled: !!location,
  });
  return {
    disaster: data?.disasters,
    loadingdiaster: isLoading,
    disastererr: isError,
  };
}
