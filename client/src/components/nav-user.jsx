"use client"

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
import { EllipsisVerticalIcon, CircleUserRoundIcon, Trash, LogOutIcon } from "lucide-react"
import { logout } from "@/services/AuthService"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

export function NavUser({ user }) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      const res = await logout()
      if (res.status === 200) {
        toast.success(res.data?.message || 'Logged out successfully', {
          duration: 4000,
          position: 'top-right',
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        navigate('/login');
      }
    } catch (error) {
     
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Logout failed';
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
      console.error("Logout Error:", errorMessage);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton 
                size="lg" 
                className="aria-expanded:bg-muted cursor-pointer" 
              />
            }
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {user.name?.charAt(0)?.toUpperCase()}
                {user.name?.charAt(1)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-foreground/70">
                {user.email}
              </span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name?.charAt(0)?.toUpperCase()}
                      {user.name?.charAt(1)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="py-2 cursor-pointer">
                <CircleUserRoundIcon className="mr-2 h-4 w-4" />
                <Link to="/account-settings">Account Settings</Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="py-2 cursor-pointer">
                <Trash className="mr-2 h-4 w-4" />
                <Link to="/bin">Users Bin</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="py-2 cursor-pointer "
              onClick={handleLogout}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}