import { useQuery } from "@tanstack/react-query";
import type { Params } from "./type";
import { getEarthquake } from "@/services/earthService";

export function useEarthQuake({ page, search, location, limit }: Params) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["earthquake"],
    queryFn: () =>
      getEarthquake({
        page,
        limit,
        search,
        lat: location?.lat ?? 9.03,
        lon: location?.lon ?? 38.74,
      }),
    enabled: !!location,
  });
  return {
    earthquake: data,
    earthquakeloading: isLoading,
    earthquekeerr: isError,
  };
}
