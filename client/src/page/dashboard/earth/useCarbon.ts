import { useQuery } from "@tanstack/react-query";
import type { Params } from "./type";
import { getCarbon } from "@/services/earthService";

export function useCarbon({ page, search, location, limit }: Params) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["carbon"],
    queryFn: () =>
      getCarbon({
        page,
        limit,
        search,
        lat: location?.lat ?? 9.03,
        lon: location?.lon ?? 38.74,
      }),
    enabled: !!location,
  });
  return { carbon: data, carbonloading: isLoading, carbonerr: isError };
}
