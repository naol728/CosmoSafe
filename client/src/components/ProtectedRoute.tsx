import { Navigate, Outlet } from "react-router-dom";
// import Cookies from "js-cookie";
import { useAppSelector } from "@/store/hook";
import { Loading } from "./Loading";

export function ProtectedRoute() {
    const { loading } = useAppSelector((state) => state.auth);
    const session = localStorage.getItem("access_token");

    if (loading) return <Loading />

    if (!session) return <Navigate to="/auth" replace />;

    return <Outlet />;
}
