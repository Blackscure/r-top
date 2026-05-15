import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

interface User {
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
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

  const login = (email: string, password: string) => {
    const stored = localStorage.getItem("registeredUsers")
    if (!stored) return false
    const users: { name: string; email: string; password: string }[] = JSON.parse(stored)
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) return false
    const loggedIn = { name: found.name, email: found.email }
    setUser(loggedIn)
    localStorage.setItem("user", JSON.stringify(loggedIn))
    return true
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
