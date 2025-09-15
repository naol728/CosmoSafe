import { useLocation, Link } from "react-router-dom"
import { useState } from "react"
import {
    Home,
    DiscIcon,
    Settings,
    Rocket,
    Globe,
    Satellite,
    LogOut,
    ChevronsUpDown,
    Image,
    User,
    DessertIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/store/hook"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const items = [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "Earth Monitoring", url: "/dashboard/earth", icon: Globe },
    { title: "Space Tracking", url: "/dashboard/space", icon: Satellite },
    { title: "Discovery", url: "/dashboard/discovery", icon: DiscIcon },
    { title: "AI Insights", url: "/dashboard/insights", icon: Rocket },
    { title: "Space Images", url: "/dashboard/images", icon: Image },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
]
const adminitems = [
    { title: "Home", url: "/admin", icon: Home },
    { title: "Users", url: "/admin/users", icon: User },
    { title: "DataSource", url: "/admin/source", icon: DessertIcon },
    { title: "Settings", url: "/admin/settings", icon: Settings }
]

export function AppSidebar() {
    const user = useAppSelector((state) => state.auth.user)
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    return (
        <Sidebar className="w-72 bg-gradient-to-b from-black/90 via-purple-950/60 to-black/95 text-foreground border-r border-white/10 backdrop-blur-xl flex flex-col">
            <SidebarContent className="flex-1">
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-2 text-2xl font-extrabold tracking-wide text-pink-400 py-8">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                            <span className="text-white font-bold">C</span>
                        </div>
                        <span className="bg-gradient-to-r from-pink-400 to-red-400 text-transparent bg-clip-text">
                            CosmoSafe
                        </span>
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="mt-6 space-y-2">

                            {
                                user?.user?.is_admin ? adminitems.map((item) => {
                                    const isActive = location.pathname === item.url
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link
                                                    to={item.url}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                                        ? "bg-pink-500/20 text-pink-300"
                                                        : "hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-red-500/20 hover:text-pink-300"
                                                        }`}
                                                >
                                                    <item.icon
                                                        className={`h-6 w-6 transition ${isActive
                                                            ? "text-pink-300"
                                                            : "text-pink-400 group-hover:text-pink-300"
                                                            }`}
                                                    />
                                                    <span className="font-medium text-base">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                }) :
                                    items.map((item) => {
                                        const isActive = location.pathname === item.url
                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild>
                                                    <Link
                                                        to={item.url}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                                            ? "bg-pink-500/20 text-pink-300"
                                                            : "hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-red-500/20 hover:text-pink-300"
                                                            }`}
                                                    >
                                                        <item.icon
                                                            className={`h-6 w-6 transition ${isActive
                                                                ? "text-pink-300"
                                                                : "text-pink-400 group-hover:text-pink-300"
                                                                }`}
                                                        />
                                                        <span className="font-medium text-base">{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <div className="p-4 border-t border-white/10">
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 cursor-pointer">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border border-pink-500/40">
                                <AvatarImage src="https://static.vecteezy.com/system/resources/previews/005/266/979/non_2x/avatar-profile-pink-neon-icon-brick-wall-background-colour-neon-icon-vector.jpg" alt="@user" />
                                <AvatarFallback>
                                    {user?.user ? user.user.email[0].toUpperCase() : "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold text-foreground">{user?.user?.email}</p>
                                <p className="text-xs text-muted-foreground">
                                    {user?.user?.is_premium
                                        ? "Premium"
                                        : user?.user?.is_admin
                                            ? "Admin"
                                            : "Regular"}
                                </p>
                            </div>
                        </div>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 text-pink-400 hover:text-pink-300">
                                <ChevronsUpDown className="h-5 w-5" />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                        <Button variant="ghost" className="w-full flex items-center justify-center gap-2 text-pink-400 hover:bg-pink-500/10 hover:text-pink-300">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </Button>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </Sidebar>
    )
}
