import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppSelector } from "@/store/hook";

export function ProtectedRoute() {
    const { loading } = useAppSelector((state) => state.auth);
    const session = Cookies.get("session");

    if (loading) return (<div>loading...</div>)

    if (!session) return <Navigate to="/auth" replace />;

    return <Outlet />;
}
