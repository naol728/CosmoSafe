import { getUserNeoObject } from "@/services/spaceService";
import { useQuery } from "@tanstack/react-query";

export default function useUserNeoObject() {
  const { data: userNeoObjects, isLoading: userNeoLoading } = useQuery({
    queryKey: ["userNeoObjects"],
    queryFn: getUserNeoObject,
  });
  return { userNeoObjects, userNeoLoading };
}
