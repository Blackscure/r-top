import { useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Mail, Key, Lock, Loader2, AlertCircle, HandHeart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"

export default function VerifyOtp() {
  const location = useLocation()
  const emailFromState = (location.state as { email?: string })?.email || ""
  const [email] = useState(emailFromState)
  const [otp, setOtp] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { verifyLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !otp || !pin) {
      setError("Please fill in all fields")
      return
    }
    setLoading(true)
    const result = await verifyLogin(email, otp, pin)
    setLoading(false)
    if (result.success) {
      toast.success("Login successful")
      navigate("/dashboard")
    } else {
      setError(result.error || "Verification failed")
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0B2B26]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(212,162,76,0.18), transparent 45%), radial-gradient(circle at 80% 85%, rgba(45,122,111,0.35), transparent 50%), linear-gradient(160deg, #0B2B26 0%, #123A34 100%)",
        }}
      />
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
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2D7A6F] via-[#D4A24C] to-[#2D7A6F]" />

        <CardHeader className="pt-8 pb-2">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B2B26]">
            <HandHeart className="h-5 w-5 text-[#D4A24C]" strokeWidth={2} />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-[#0B2B26]">
            Verify login
          </CardTitle>
          <CardDescription className="text-[#5B6B68]">
            Enter the OTP sent to your email and set your PIN
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
                  value={email}
                  readOnly
                  className="pl-9 border-[#DCE3E1] bg-[#F5F7F6] text-[#5B6B68] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp" className="text-[#0B2B26]">OTP Code</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A9A97]" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-9 border-[#DCE3E1] focus-visible:ring-[#2D7A6F] focus-visible:border-[#2D7A6F]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-[#0B2B26]">Transaction PIN</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A9A97]" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
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
                  Verifying...
                </span>
              ) : (
                "Verify & Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
