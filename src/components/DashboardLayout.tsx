import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const displayName = user ? `${user.first_name} ${user.last_name}` : "User"
  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : "U"

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate("/login")
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card px-6 flex items-center justify-end">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 z-50">
                <div className="px-1.5 py-1 font-normal">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{displayName}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
                <div className="-mx-1 my-1 h-px bg-border" />
                <button
                  onClick={() => { setOpen(false); navigate("/profile") }}
                  className="group/dropdown-menu-item relative flex w-full cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="group/dropdown-menu-item relative flex w-full cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground text-destructive"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  )
}