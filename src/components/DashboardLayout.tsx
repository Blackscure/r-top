import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDown, User, LogOut } from "lucide-react"
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
    <div className="flex min-h-screen bg-[#F7F9F8]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[#E3E8E6] bg-white px-6 flex items-center justify-end">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2.5 cursor-pointer rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-[#EEF3F1]"
            >
              <Avatar className="h-8 w-8 ring-2 ring-[#D4A24C]/40">
                <AvatarFallback className="bg-[#0B2B26] text-[#D4A24C] text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium text-[#0B2B26]">{displayName}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-[#8A9A97] transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#E3E8E6] bg-white p-1.5 shadow-lg shadow-black/5 z-50">
                <div className="px-2.5 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#0B2B26]">{displayName}</span>
                    <span className="text-xs text-[#8A9A97] truncate">{user?.email}</span>
                  </div>
                </div>
                <div className="my-1 h-px bg-[#E3E8E6]" />
                <button
                  onClick={() => { setOpen(false); navigate("/profile") }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-[#0B2B26] outline-hidden select-none hover:bg-[#EEF3F1]"
                >
                  <User className="h-4 w-4 text-[#8A9A97]" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-600 outline-hidden select-none hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-8 bg-[#F7F9F8]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}