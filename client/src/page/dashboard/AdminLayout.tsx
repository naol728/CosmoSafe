import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet } from "react-router-dom"

export default function AdminLayout() {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen overflow-hidden">

                <AppSidebar />


                <div className="flex-1 flex flex-col bg-background">

                    <header className="flex items-center justify-between px-8 py-3 border-b border-border bg-background/80 backdrop-blur-md">
                        <SidebarTrigger />

                        <div className="flex items-center gap-4">
                            <span className="text-lg text-muted-foreground flex items-center gap-2">
                                Hi 👋,

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
