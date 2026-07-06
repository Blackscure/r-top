import { useState, type FormEvent } from "react"
import { Phone, Wallet, Clock, CheckCircle2, XCircle, Send, AlertCircle, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import axios from "axios"

interface FundRequest {
  id: number
  phone: string
  amount: number
  status: "pending" | "approved" | "rejected"
  date: string
}

const statusStyles: Record<FundRequest["status"], string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  rejected: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50",
  pending: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
}

const statusIcons: Record<FundRequest["status"], React.ElementType> = {
  approved: CheckCircle2,
  rejected: XCircle,
  pending: Clock,
}

export default function ReqFunds() {
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [requests, setRequests] = useState<FundRequest[]>(() => {
    const stored = localStorage.getItem("fundRequests")
    return stored ? JSON.parse(stored) : []
  })
  const [error, setError] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (!phone || !amount) {
      setError("Please fill in all fields")
      return
    }
    if (!/^\d{9,}$/.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid phone number")
      return
    }
    const rawPhone = phone.replace(/\s/g, "")
    const formattedPhone = rawPhone.startsWith("0") ? "254" + rawPhone.slice(1) : rawPhone
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount")
      return
    }
    const newRequest: FundRequest = {
      id: Date.now(),
      phone: formattedPhone,
      amount: amt,
      status: "pending",
      date: new Date().toLocaleDateString(),
    }
    const updated = [newRequest, ...requests]
    setRequests(updated)
    localStorage.setItem("fundRequests", JSON.stringify(updated))
    const token = localStorage.getItem("access_token")
    axios.post("http://127.0.0.1:8000/apps/wallet/api/v1/transactions/stk-push/", {
      phone_number: formattedPhone,
      amount: amt,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => toast.success("Request submitted successfully"))
      .catch((err) => toast.error(err.response?.data?.message || err.message))
    setPhone("")
    setAmount("")
  }

  const totalRequested = requests.reduce((sum, r) => sum + r.amount, 0)
  const pendingCount = requests.filter((r) => r.status === "pending").length

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-[#0B2B26] px-6 py-7 sm:px-8">
        <svg className="absolute -right-10 -top-10 h-56 w-56 opacity-[0.12] pointer-events-none" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="190" stroke="#D4A24C" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" stroke="#D4A24C" strokeWidth="1" />
          <circle cx="200" cy="200" r="90" stroke="#D4A24C" strokeWidth="1" />
        </svg>
        <div className="relative flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Request Funds</h1>
          <p className="text-[#9FB6B1]">Submit a new fund request via M-Pesa STK push</p>
        </div>
        {requests.length > 0 && (
          <div className="relative mt-5 flex flex-wrap gap-6 border-t border-white/10 pt-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#7FA39C]">Total requested</p>
              <p className="text-lg font-semibold text-white">Kes {totalRequested.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#7FA39C]">Pending</p>
              <p className="text-lg font-semibold text-[#D4A24C]">{pendingCount}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#7FA39C]">Total requests</p>
              <p className="text-lg font-semibold text-white">{requests.length}</p>
            </div>
          </div>
        )}
      </div>

      <Card className="border-[#E3E8E6] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0B2B26]">
            <Send className="h-4 w-4 text-[#1F6357]" />
            New Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A9A97]" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 border-[#DCE3E1] focus-visible:ring-[#2D7A6F] focus-visible:border-[#2D7A6F]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (Kes)</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A9A97]" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9 border-[#DCE3E1] focus-visible:ring-[#2D7A6F] focus-visible:border-[#2D7A6F]"
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="bg-[#1F6357] hover:bg-[#194F46] text-white font-medium">
              <Send className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>

      {requests.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#0B2B26]">Your Requests</h2>
          {requests.map((req) => {
            const StatusIcon = statusIcons[req.status]
            return (
              <Card key={req.id} className="border-[#E3E8E6] transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3F1]">
                      <Phone className="h-4 w-4 text-[#1F6357]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0B2B26]">{req.phone}</p>
                      <p className="text-sm text-muted-foreground">{req.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <p className="font-semibold text-[#0B2B26]">${req.amount.toFixed(2)}</p>
                    <Badge variant="outline" className={`gap-1 ${statusStyles[req.status]}`}>
                      <StatusIcon className="h-3 w-3" />
                      {req.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#DCE3E1] py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3F1]">
            <Inbox className="h-5 w-5 text-[#8A9A97]" />
          </div>
          <p className="font-medium text-[#0B2B26]">No requests yet</p>
          <p className="text-sm text-muted-foreground">Submit your first fund request above</p>
        </div>
      )}
    </div>
  )
}