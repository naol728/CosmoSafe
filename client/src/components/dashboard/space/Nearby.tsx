/*eslint-disable*/
import { createNeoAlert, fetchNearByObjects, getUserNeoObject } from '@/services/spaceService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Globe, Save, Zap, Calendar, Gauge, ArrowRight, Shield } from "lucide-react";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useUserNeoObject from '@/hooks/spacehooks/useUserNeoObject';

type NearbyObject = {
    id: string;
    name: string;
    nasa_jpl_url: string;
    magnitude: number;
    is_potentially_hazardous: boolean;
    close_approach_date: string;
    relative_velocity: string;
    miss_distance: string;
    orbiting_body: string;
};

export default function Nearby() {
    const queryClient = useQueryClient();

    const { data: nearbyObjects, isLoading: nearbyLoading } = useQuery<NearbyObject[]>({
        queryKey: ["nearbyObjects"],
        queryFn: fetchNearByObjects,
    });
    const { userNeoObjects, userNeoLoading } = useUserNeoObject()



    const { mutate, isPending } = useMutation({
        mutationFn: createNeoAlert,
        mutationKey: ["createNeoAlert"],
        onSuccess: () => {
            toast.success("Nearby object saved successfully 🚀");
            queryClient.invalidateQueries({ queryKey: ["userNeoObjects"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });

    const handleAddNeoAlert = (data: any) => {
        mutate(data);
    };

    const isNeoSaved = (obj: NearbyObject) => {
        return userNeoObjects?.some((savedObj: any) => savedObj.id === obj.id);
    };

    return (
        <Card className="bg-gray-900/70 border border-purple-400/30 shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400 font-bold text-lg">
                    <Globe className="w-5 h-5" />
                    Nearby Objects
                </CardTitle>
            </CardHeader>
            <CardContent>
                {nearbyLoading || userNeoLoading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : nearbyObjects?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nearbyObjects.map((obj) => {
                            const disabled = isNeoSaved(obj);

                            return (
                                <div
                                    key={obj.id}
                                    className={`p-4 rounded-xl border transition transform hover:scale-[1.02] hover:shadow-lg ${obj.is_potentially_hazardous
                                        ? "bg-red-900/20 border-red-400/30"
                                        : "bg-green-900/20 border-green-400/30"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-purple-200">{obj.name}</h3>
                                        {obj.is_potentially_hazardous ? (
                                            <span className="flex items-center gap-1 text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                                                <Shield size={12} /> Hazardous
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                                                <Shield size={12} /> Safe
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-2 space-y-1 text-gray-300 text-sm">
                                        <p className="flex items-center gap-2">
                                            <Gauge size={14} className="text-yellow-400" />
                                            Magnitude: <span className="font-medium">{obj.magnitude}</span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Calendar size={14} className="text-blue-400" />
                                            Close Approach:{" "}
                                            <span className="font-medium">
                                                {new Date(obj.close_approach_date).toLocaleDateString()}
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Zap size={14} className="text-orange-400" />
                                            Velocity:{" "}
                                            <span className="font-medium">
                                                {parseFloat(obj.relative_velocity).toFixed(2)} km/h
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <ArrowRight size={14} className="text-green-400" />
                                            Miss Distance:{" "}
                                            <span className="font-medium">
                                                {parseFloat(obj.miss_distance).toLocaleString()} km
                                            </span>
                                        </p>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <a
                                            href={obj.nasa_jpl_url}
                                            target="_blank"
                                            className="text-xs text-purple-300 hover:text-purple-200 underline"
                                        >
                                            NASA Details →
                                        </a>
                                        <Button
                                            onClick={() => handleAddNeoAlert(obj)}
                                            disabled={disabled || isPending}
                                            className="flex items-center gap-1"
                                        >
                                            <Save size={16} />
                                            {disabled ? "Saved" : "Save"}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No nearby objects 🌌</p>
                )}
            </CardContent>
        </Card>
    );
}
