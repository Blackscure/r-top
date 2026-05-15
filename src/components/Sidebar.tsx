import { NavLink } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="w-64 min-h-screen bg-green-800 text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-white">Dashboard</h2>
        <p className="text-sm text-green-200 mt-1">{user?.name}</p>
      </div>

      <Separator className="bg-green-700" />

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/dashboard/req-funds"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-green-600 text-white"
                : "text-green-100 hover:bg-green-700 hover:text-white"
            }`
          }
        >
          Req Funds
        </NavLink>
        <NavLink
          to="/dashboard/transactions"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-green-600 text-white"
                : "text-green-100 hover:bg-green-700 hover:text-white"
            }`
          }
        >
          Transactions
        </NavLink>
      </nav>
    </aside>
  )
}
