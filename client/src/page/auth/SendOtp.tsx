import { LoginForm } from "@/components/login-form"
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { useAppSelector } from "@/store/hook";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
    const { loading, user } = useAppSelector((state) => state.auth)
    if (loading) return <>Loading...</>
    if (user) return <Navigate to="/" replace />
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm z-50">
                <LoginForm />
            </div>
            <ShootingStars minSpeed={5} minDelay={2200} />
            <StarsBackground />
        </div>
    )
}