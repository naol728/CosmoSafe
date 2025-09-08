import { getEarthquakedb } from "@/services/earthService";
import { useQuery } from "@tanstack/react-query";

export default function useEarthquakedb() {
  const { data, isError, isLoading } = useQuery({
    queryFn: getEarthquakedb,
    queryKey: ["earthquakedb"],
  });
  return {
    eqdb: data?.data,
    eqdberror: isError,
    eqdbloading: isLoading,
  };
}
