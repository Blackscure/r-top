import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/services/ApiService"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  user_type: number
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post(
        "http://127.0.0.1:8000/apps/wallet/api/v1/authentication/login/",
        { email, password },
      )
      const userData = response.data.data.user
      setUser(userData)
      localStorage.setItem("access_token", response.data.data.access_token)
      localStorage.setItem("user", JSON.stringify(userData))
      return { success: true }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return { success: false, error: err.response?.data?.message || "Login failed" }
    }
  }

  const register = (name: string, email: string, password: string) => {
    const stored = localStorage.getItem("registeredUsers")
    const users: { name: string; email: string; password: string }[] = stored ? JSON.parse(stored) : []
    if (users.some((u) => u.email === email)) return false
    users.push({ name, email, password })
    localStorage.setItem("registeredUsers", JSON.stringify(users))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate("/login")
  }, [user, navigate])

  if (!user) return null
  return <>{children}</>
}
