import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BadgeCheckIcon,
  LogOutIcon,
  ArrowRightFromLine
} from "lucide-react"

import { logout } from "@/services/AuthService"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"

export function ProfileDropdown({user}) {
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

  const userInitials = user.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
          <Avatar>
            <AvatarImage src="/avatars/shadcn.jpg" alt="shadcn" />
            <AvatarFallback>
              {userInitials}
            </AvatarFallback>
          </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=>{navigate("/home?account=update")}}>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>{navigate("/home?exportReport=true")}}>
            <ArrowRightFromLine />
            Export
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
