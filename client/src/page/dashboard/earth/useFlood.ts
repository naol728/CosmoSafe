import { useQuery } from "@tanstack/react-query";
import type { Params } from "./type";
import { getFlood } from "@/services/earthService";

export function useFlood({ page, search, location, limit }: Params) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["flood"],
    queryFn: () =>
      getFlood({
        page,
        limit,
        search,
        lat: location?.lat ?? 9.03,
        lon: location?.lon ?? 38.74,
      }),
    enabled: !!location,
  });
  return { flood: data, floodloading: isLoading, flooderr: isError };
}
