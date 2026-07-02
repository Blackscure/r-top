import { useState, type FormEvent } from "react"
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Request Funds</h1>
        <p className="text-muted-foreground">Submit a new fund request</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="07XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input id="amount" type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button type="submit">Submit Request</Button>
          </form>
        </CardContent>
      </Card>

      {requests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Requests</h2>
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{req.phone}</p>
                  <p className="text-sm text-muted-foreground">{req.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${req.amount.toFixed(2)}</p>
                  <Badge
                    variant={
                      req.status === "approved" ? "default" :
                      req.status === "rejected" ? "destructive" : "secondary"
                    }
                  >
                    {req.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
