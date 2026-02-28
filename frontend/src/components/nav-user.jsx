import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
    MoreVerticalIcon,
    UserCircleIcon,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function NavUser() {
    const { isMobile } = useSidebar()
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = localStorage.getItem('currentUser')
            if (!storedUser) {
                setLoading(false)
                return
            }

            try {
                const parsedUser = JSON.parse(storedUser)
                const response = await fetch(`http://127.0.0.1:8000/api/admins/${parsedUser.id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    setUserInfo(data)
                } else {
                    console.error('Failed to fetch user details')
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        navigate('/adminlog')
    }

    if (loading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex items-center gap-2 px-2 py-1.5 animate-pulse">
                        <div className="h-8 w-8 rounded-lg bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-20 rounded bg-muted" />
                            <div className="h-2 w-32 rounded bg-muted" />
                        </div>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    if (!userInfo) return null

    const userToDisplay = {
        name: userInfo.name || "Admin",
        email: userInfo.email || "",
        avatar: "/avatars/admin.jpg",
    }

    const initials = userToDisplay.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground text-black"
                        >
                            <Avatar className="h-8 w-8 rounded-lg grayscale text-black">
                                <AvatarImage src={userToDisplay.avatar} alt={userToDisplay.name} />
                                <AvatarFallback className="rounded-lg text-black">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{userToDisplay.name}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {userToDisplay.email}
                                </span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 border border-gray-200 rounded-lg bg-gray-800"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal text-white">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={userToDisplay.avatar} alt={userToDisplay.name} />
                                    <AvatarFallback className="rounded-lg text-black">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium text-white">{userToDisplay.name}</span>
                                    <span className="truncate text-xs text-white">
                                        {userToDisplay.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="text-white hover:bg-gray-700">
                                <UserCircleIcon />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-700">
                                <CreditCardIcon />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-700">
                                <BellIcon />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-gray-700">
                            <LogOutIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
