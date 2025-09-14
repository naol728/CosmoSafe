import { getUserCollision } from "@/services/spaceService";
import { useQuery } from "@tanstack/react-query";

export default function useUserCollision() {
  const { data: usercollisonsRaw, isLoading: usercollisionsLoading } = useQuery(
    {
      queryKey: ["userCollisionAlerts"],
      queryFn: getUserCollision,
    }
  );
  return { usercollisonsRaw, usercollisionsLoading };
}
