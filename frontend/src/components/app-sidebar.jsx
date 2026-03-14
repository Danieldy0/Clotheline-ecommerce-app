"use client"

import * as React from "react"
import {
    ArrowUpCircleIcon,
    BarChartIcon,
    CameraIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    SearchIcon,
    SettingsIcon,
    UsersIcon,
} from "lucide-react"
import { Link } from "react-router-dom"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/administration",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Products",
            url: "/administration/products",
            icon: FileTextIcon,
        },
        {
            title: "Inventory",
            url: "/administration/inventory",
            icon: ClipboardListIcon,
        },
        {
            title: "Customers",
            url: "/administration",
            icon: UsersIcon,
        },
        {
            title: "Analytics",
            url: "/administration",
            icon: BarChartIcon,
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/administration",
            icon: SettingsIcon,
        },
        {
            title: "Help Center",
            url: "/administration",
            icon: HelpCircleIcon,
        },
    ],
    documents: [
        {
            name: "Orders",
            url: "/administration",
            icon: DatabaseIcon,
        },
        {
            name: "Promotions",
            url: "/administration",
            icon: ArrowUpCircleIcon,
        },
        {
            name: "Stock Reports",
            url: "/administration",
            icon: FileIcon,
        },
    ],
}

export function AppSidebar({ ...props }) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5 dark:text-white text-black"
                        >
                            <Link to="/administration">
                                <ArrowUpCircleIcon className="h-5 w-5" />
                                <span className="text-base font-semibold dark:text-white text-black">Clothline.</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
