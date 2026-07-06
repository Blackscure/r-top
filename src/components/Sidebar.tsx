import { NavLink } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { HandHeart, Send, Receipt } from "lucide-react"

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="w-64 min-h-screen bg-[#0B2B26] text-white flex flex-col relative overflow-hidden">
      <svg
        className="absolute -left-12 -bottom-16 h-64 w-64 opacity-[0.06] pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="190" stroke="#D4A24C" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" stroke="#D4A24C" strokeWidth="1" />
        <circle cx="200" cy="200" r="90" stroke="#D4A24C" strokeWidth="1" />
      </svg>

      <div className="relative p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <HandHeart className="h-4 w-4 text-[#D4A24C]" strokeWidth={2} />
          </div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Dashboard</h2>
        </div>
        <p className="text-sm text-[#9FB6B1] mt-2 truncate">{user?.name}</p>
      </div>

      <Separator className="bg-white/10" />

      <nav className="relative flex-1 p-4 space-y-1.5">
        <NavLink
          to="/req-funds"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#1F6357] text-white"
                : "text-[#9FB6B1] hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <Send className="h-4 w-4" />
          Req funds
        </NavLink>
        <NavLink
          to="/dashboard/transactions"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#1F6357] text-white"
                : "text-[#9FB6B1] hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <Receipt className="h-4 w-4" />
          Transactions
        </NavLink>
      </nav>
    </aside>
  )
}