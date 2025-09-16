/* eslint-disable */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getAllUsers, getTopUsers } from "@/services/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Loading } from "@/components/Loading";
import Error from "@/components/Error";

export default function Users() {
    const { data: allusers, isLoading: alluserloading, isError: allusererror } = useQuery({
        queryFn: getAllUsers,
        queryKey: ["getAllUsers"],
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success("Deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
            queryClient.invalidateQueries({ queryKey: ["getTopUsers"] });
        },
        onError: (err: any) => {
            toast.error(err.message);
        },
    });

    const { data: topusers, isLoading: istopuserloading, isError: istopusererror } = useQuery({
        queryFn: getTopUsers,
        queryKey: ["getTopUsers"],
    });

    if (alluserloading || istopuserloading) return <Loading />;
    if (allusererror || istopusererror) return <Error />;

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">
                👥 Manage Users
            </h1>

            {/* All Users */}
            <div className="space-y-4">
                {allusers?.users?.map((user: any) => (
                    <Card key={user.id} className="sm:flex sm:items-center sm:justify-between p-4">
                        <div className="space-y-1 sm:space-y-0 sm:space-x-4 sm:flex sm:items-center">
                            <p className="font-medium break-words">{user.email}</p>
                            <p className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</p>
                            <Badge
                                variant="outline"
                                className={user.is_admin ? "border-blue-600 text-blue-600" : "border-gray-500 text-gray-500"}
                            >
                                {user.is_admin ? "Admin" : "User"}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={user.is_premium ? "border-green-600 text-green-600" : "border-gray-400 text-gray-500"}
                            >
                                {user.is_premium ? "Premium" : "Regular"}
                            </Badge>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={isPending || user.is_admin}
                                onClick={() => mutate(user.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Top Users */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">🏆 Top Users (by API Requests)</h2>
                {topusers?.topUsers
                    ?.filter((user: any) => user.email)
                    .sort((a: any, b: any) => Number(b.requestCount) - Number(a.requestCount))
                    .map((user: any) => (
                        <Card key={user.userId} className="sm:flex sm:items-center sm:justify-between p-4">
                            <div className="space-y-1 sm:space-y-0 sm:space-x-4 sm:flex sm:items-center">
                                <p className="font-medium break-words">{user.email}</p>
                                <Badge variant="outline" className="border-purple-600 text-purple-600">
                                    {user.requestCount}
                                </Badge>
                            </div>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
