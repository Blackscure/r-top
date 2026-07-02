import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios"

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
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">View all your recent transactions</p>
      </div>

      <div className="flex gap-4">
        <Badge variant="default" className="text-sm px-4 py-1">Success: {stats.success}</Badge>
        <Badge variant="secondary" className="text-sm px-4 py-1">Pending: {stats.pending}</Badge>
        <Badge variant="destructive" className="text-sm px-4 py-1">Failed: {stats.failed}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">Loading...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="text-left px-6 py-3 font-medium">Phone Number</th>
                  <th className="text-right px-6 py-3 font-medium">Amount</th>
                  <th className="text-center px-6 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">{tx.phone_number}</td>
                    <td className="px-6 py-4 text-right font-semibold">${tx.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={statusVariant(tx.status)}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{formatDate(tx.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1 || loading}
            onClick={() => fetchTransactions(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || loading}
            onClick={() => fetchTransactions(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
