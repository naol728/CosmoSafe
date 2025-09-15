/* eslint-disable */
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getAllUsers, getTopUsers } from "@/services/admin";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Loading } from "@/components/Loading";
import Error from "@/components/Error";

export default function Users() {
    const {
        data: allusers,
        isLoading: alluserloading,
        isError: allusererror,
    } = useQuery({
        queryFn: getAllUsers,
        queryKey: ["getAllUsers"],
    });
    const queryclient = useQueryClient()
    const {
        mutate, isPending
    } = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            toast.success("deleted sucessfuly")
            queryclient.invalidateQueries({ queryKey: ["getAllUsers"] })
            queryclient.invalidateQueries({ queryKey: ["getTopUsers"] })
        },
        onError: (err) => {
            toast.error(err.message)
        }
    })

    const {
        data: topusers,
        isLoading: istopuserloading,
        isError: istopusererror,
    } = useQuery({
        queryFn: getTopUsers,
        queryKey: ["getTopUsers"],
    });

    if (alluserloading || istopuserloading) return <Loading />;
    if (allusererror || istopusererror) return <Error />;

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">👥 Manage Users</h1>

            {/* All Users */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Delete user</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allusers?.users?.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                user.is_admin
                                                    ? "border-blue-600 text-blue-600"
                                                    : "border-gray-500 text-gray-500"
                                            }
                                        >
                                            {user.is_admin ? "Admin" : "User"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.is_premium ? (
                                            <Badge
                                                variant="outline"
                                                className="border-green-600 text-green-600"
                                            >
                                                Premium
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="border-gray-400 text-gray-500"
                                            >
                                                Regular
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="destructive" disabled={isPending || user.is_admin} onClick={() => mutate(user.id)}><Trash2 /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Top Users */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">
                        🏆 Top Users (by API Requests)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Request Count</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topusers?.topUsers
                                ?.filter((user: any) => user.email)
                                .sort(
                                    (a: any, b: any) =>
                                        Number(b.requestCount) -
                                        Number(a.requestCount)
                                )
                                .map((user: any) => (
                                    <TableRow key={user.userId}>
                                        <TableCell className="font-medium">
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="border-purple-600 text-purple-600"
                                            >
                                                {user.requestCount}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
