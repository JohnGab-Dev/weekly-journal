import * as React from "react"

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
import { LayoutDashboardIcon, ChartBarIcon, UsersRound, CalendarDays } from "lucide-react"

import { useLocation } from "react-router-dom"


  
export function AppSidebar({
  ...props
}) {

  const location = useLocation()
  const url = location.pathname

  const user = JSON.parse(localStorage.getItem("user"))

  const data = {

    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        isActive: url === '/dashboard' ? true : false,
        icon: (
          <LayoutDashboardIcon />
        ),
      },
      {
        title: "Users",
        url: "/users",
        isActive: url === '/users' ? true : false,
        icon: (
          <UsersRound />
        ),
      },
      {
        title: "Events",
        url: "/events",
        isActive: url === '/events' ? true : false,
        icon: (
          <CalendarDays />
        ),
      },
      {
        title: "Logs",
        url: "/user-logs",
        isActive: url === '/user-logs' ? true : false,
        icon: (
          <ChartBarIcon />
        ),
      },
    ],
    navSecondary: []
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}>
              <span className="text-base font-semibold">Report Maker.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
