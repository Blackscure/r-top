import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios"
import { CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight, Receipt, Phone } from "lucide-react"

interface Transaction {
  id: number
  amount: number
  phone_number: string
  status: string
  mpesa_receipt_number: string | null
  created_at: string
}

interface Stats {
  success: number
  pending: number
  failed: number
}

const statusConfig: Record<string, { className: string; icon: React.ElementType }> = {
  Success: { className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50", icon: CheckCircle2 },
  Pending: { className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50", icon: Clock },
  Failed: { className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50", icon: XCircle },
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<Stats>({ success: 0, pending: 0, failed: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchTransactions = (page: number) => {
    const token = localStorage.getItem("access_token")
    setLoading(true)
    axios.get(`http://127.0.0.1:8000/apps/wallet/api/v1/transactions/transactions-list/?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setTransactions(res.data.data.transactions)
        setStats(res.data.data.stats)
        setCurrentPage(res.data.current_page)
        setTotalPages(res.data.pages)
      })
      .catch((err) => toast.error(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTransactions(1)
  }, [])

  const statusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "Success") return "default"
    if (status === "Pending") return "secondary"
    if (status === "Failed") return "destructive"
    return "outline"
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#0B2B26] px-6 py-7 sm:px-8">
        <svg className="absolute -right-10 -top-10 h-56 w-56 opacity-[0.12] pointer-events-none" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="190" stroke="#D4A24C" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" stroke="#D4A24C" strokeWidth="1" />
          <circle cx="200" cy="200" r="90" stroke="#D4A24C" strokeWidth="1" />
        </svg>
        <div className="relative flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Transactions</h1>
          <p className="text-[#9FB6B1]">View all your recent transactions</p>
        </div>
        <div className="relative mt-5 flex flex-wrap gap-6 border-t border-white/10 pt-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[#7FA39C]">Success</p>
            <p className="text-lg font-semibold text-white">{stats.success}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[#7FA39C]">Pending</p>
            <p className="text-lg font-semibold text-[#D4A24C]">{stats.pending}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-[#7FA39C]">Failed</p>
            <p className="text-lg font-semibold text-[#F3A9A0]">{stats.failed}</p>
          </div>
        </div>
      </div>

      <Card className="border-[#E3E8E6] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0B2B26]">
            <Receipt className="h-4 w-4 text-[#1F6357]" />
            All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-11 w-full animate-pulse rounded-lg bg-[#EEF3F1]" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF3F1]">
                <Receipt className="h-5 w-5 text-[#8A9A97]" />
              </div>
              <p className="font-medium text-[#0B2B26]">No transactions yet</p>
              <p className="text-sm text-muted-foreground">Your transaction history will show up here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0B2B26] text-white">
                    <th className="text-left px-6 py-3 font-medium text-sm">Phone Number</th>
                    <th className="text-right px-6 py-3 font-medium text-sm">Amount</th>
                    <th className="text-center px-6 py-3 font-medium text-sm">Status</th>
                    <th className="text-right px-6 py-3 font-medium text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const config = statusConfig[tx.status] ?? { className: "", icon: Clock }
                    const StatusIcon = config.icon
                    return (
                      <tr key={tx.id} className="border-b border-[#E3E8E6] transition-colors hover:bg-[#F5F8F7]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF3F1]">
                              <Phone className="h-3.5 w-3.5 text-[#1F6357]" />
                            </div>
                            <span className="font-medium text-[#0B2B26]">{tx.phone_number}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-[#0B2B26]">Kes {tx.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="outline" className={`gap-1 ${config.className}`}>
                            <StatusIcon className="h-3 w-3" />
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">{formatDate(tx.created_at)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page <span className="font-medium text-[#0B2B26]">{currentPage}</span> of{" "}
          <span className="font-medium text-[#0B2B26]">{totalPages}</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#DCE3E1] hover:bg-[#EEF3F1] hover:text-[#0B2B26]"
            disabled={currentPage === 1 || loading}
            onClick={() => fetchTransactions(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#DCE3E1] hover:bg-[#EEF3F1] hover:text-[#0B2B26]"
            disabled={currentPage === totalPages || loading}
            onClick={() => fetchTransactions(currentPage + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}