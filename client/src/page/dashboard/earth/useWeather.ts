import { useQuery } from "@tanstack/react-query";
import type { Params } from "./type";
import { getWeather } from "@/services/earthService";

export function useWeather({ page, search, location, limit }: Params) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["weather"],
    queryFn: () =>
      getWeather({
        page,
        limit,
        search,
        lat: location?.lat ?? 9.03,
        lon: location?.lon ?? 38.74,
      }),
    enabled: !!location,
  });
  return { weather: data, weatherloading: isLoading, weathererr: isError };
}
