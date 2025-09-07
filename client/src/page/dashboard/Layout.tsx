import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"
import { useAppSelector } from "@/store/hook"

export default function Layout() {
    const user = useAppSelector((state) => state.auth.user)
    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen overflow-hidden">

                <AppSidebar />


                <div className="flex-1 flex flex-col bg-background">

                    <header className="flex items-center justify-between px-7 py-3 border-b border-border bg-background/80 backdrop-blur-md">
                        <SidebarTrigger />

                        <div className="flex items-center gap-4">
                            <span className="text-lg text-muted-foreground flex items-center gap-2">
                                Hi 👋,  <span className="ml-1 bg-gradient-to-r from-pink-400 via-red-400 to-purple-500 bg-clip-text text-transparent font-bold text-xl">
                                    {user?.user?.email?.split("@")[0]}
                                </span>

                                Welcome back,
                                <span className="text-yellow-400 animate-bounce">🚀</span>

                            </span>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto  px-8 py-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
