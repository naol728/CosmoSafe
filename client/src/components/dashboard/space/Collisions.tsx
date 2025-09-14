/* eslint-disable */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Save, Satellite, Activity, Gauge, Calendar } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCollisionAlert, fetchCollisionAlerts, getUserCollision } from '@/services/spaceService';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import useUserCollision from "@/hooks/spacehooks/useUserCollision";

type CollisionAlert = { [key: string]: any };

export default function Collisions() {
  const queryClient = useQueryClient();

  const { data: collisions, isLoading: collisionLoading } = useQuery<CollisionAlert[]>({
    queryKey: ["collisionAlerts"],
    queryFn: fetchCollisionAlerts,
  });
  const { usercollisonsRaw, usercollisionsLoading } = useUserCollision()



  const usercollisons = usercollisonsRaw?.collision || [];

  const mutation = useMutation({
    mutationFn: createCollisionAlert,
    onSuccess: () => {
      toast.success("Collision saved successfully");
      queryClient.invalidateQueries({ queryKey: ["collisionAlerts"] });
      queryClient.invalidateQueries({ queryKey: ["userCollisionAlerts"] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleAddCollision = (data: any) => {
    mutation.mutate(data);
  };

  const isCollisionSaved = (collision: any) => {
    return usercollisons.some((c: any) => c.cdmId === collision.CDM_ID);
  };

  return (
    <Card className="bg-gray-900/70 border border-red-400/30 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400 font-bold text-lg">
          <AlertCircle className="w-5 h-5" />
          Potential Collisions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {collisionLoading || usercollisionsLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : collisions?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collisions.map((c, i) => {
              const disabled = isCollisionSaved(c);
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border bg-red-900/20 border-red-500/20 transition transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-red-300 font-semibold">
                      CDM: {c.CDM_ID}
                    </h3>
                    {c.EMERGENCY_REPORTABLE === "YES" && (
                      <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                        Emergency
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-gray-300">
                    <p className="flex items-center gap-2">
                      <Satellite size={14} className="text-red-400" />
                      Sat1: <span className="font-medium">{c.SAT_1_NAME} ({c.SAT_1_ID})</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Satellite size={14} className="text-blue-400" />
                      Sat2: <span className="font-medium">{c.SAT_2_NAME} ({c.SAT_2_ID})</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={14} className="text-yellow-400" />
                      Closest Approach:{" "}
                      <span className="font-medium">{new Date(c.TCA).toLocaleString()}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Activity size={14} className="text-green-400" />
                      Range:{" "}
                      <span className="font-medium">{c.MIN_RNG} km</span>
                      <span className="text-gray-500">(closest distance)</span>
                    </p>
                    {c.PC && (
                      <p className="flex items-center gap-2">
                        <Gauge size={14} className="text-purple-400" />
                        Probability:{" "}
                        <span className="font-medium">{c.PC}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Button
                      onClick={() => handleAddCollision(c)}
                      disabled={disabled || mutation.isPending}
                      className="flex items-center gap-1"
                    >
                      <Save size={16} />
                      {mutation.isPending
                        ? "Saving..."
                        : disabled
                          ? "Saved"
                          : "Save"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No collision alerts ✅</p>
        )}
      </CardContent>
    </Card>
  );
}
