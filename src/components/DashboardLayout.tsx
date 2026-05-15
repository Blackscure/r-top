import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-background flex items-center justify-end px-6 gap-4">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent cursor-pointer outline-none"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-700 text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => { setOpen(false); navigate("/dashboard/profile") }}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  )
}