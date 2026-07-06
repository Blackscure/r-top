import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Loader2, AlertCircle, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      navigate("/req-funds")
    } else {
      setError(result.error || "Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0B2B26]">
      {/* Ambient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(212,162,76,0.18), transparent 45%), radial-gradient(circle at 80% 85%, rgba(45,122,111,0.35), transparent 50%), linear-gradient(160deg, #0B2B26 0%, #123A34 100%)",
        }}
      />
      {/* Signature motif: concentric "giving rings" */}
      <svg
        className="absolute -right-24 -top-24 h-[420px] w-[420px] opacity-[0.14] pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="190" stroke="#D4A24C" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" stroke="#D4A24C" strokeWidth="1" />
        <circle cx="200" cy="200" r="90" stroke="#D4A24C" strokeWidth="1" />
      </svg>
      <svg
        className="absolute -left-16 -bottom-16 h-72 w-72 opacity-[0.10] pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="160" stroke="#7FBFB4" strokeWidth="1" />
        <circle cx="200" cy="200" r="110" stroke="#7FBFB4" strokeWidth="1" />
      </svg>

      <Card className="relative w-full max-w-md mx-4 border-0 shadow-2xl shadow-black/40 bg-white/[0.98] backdrop-blur rounded-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2D7A6F] via-[#D4A24C] to-[#2D7A6F]" />

        <CardHeader className="pt-8 pb-2">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B2B26]">
            <HandHeart className="h-5 w-5 text-[#D4A24C]" strokeWidth={2} />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-[#0B2B26]">
            Welcome back
          </CardTitle>
          <CardDescription className="text-[#5B6B68]">
            Sign in to manage donations and track requests
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-2">
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0B2B26]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A9A97]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 border-[#DCE3E1] focus-visible:ring-[#2D7A6F] focus-visible:border-[#2D7A6F]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0B2B26]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A9A97]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 border-[#DCE3E1] focus-visible:ring-[#2D7A6F] focus-visible:border-[#2D7A6F]"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2 pb-8">
            <Button
              type="submit"
              className="w-full bg-[#1F6357] hover:bg-[#194F46] text-white font-medium transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
            <p className="text-sm text-[#5B6B68]">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-[#1F6357] font-medium underline underline-offset-4 hover:text-[#194F46]">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}