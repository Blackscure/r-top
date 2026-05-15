import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: number
  name: string
  amount: number
  pending: boolean
  date: string
}

const sampleTransactions: Transaction[] = [
  { id: 1, name: "Payment from Alice", amount: 250.0, pending: true, date: "2026-05-14" },
  { id: 2, name: "Refund to Bob", amount: 89.99, pending: false, date: "2026-05-13" },
  { id: 3, name: "Transfer to Charlie", amount: 500.0, pending: true, date: "2026-05-12" },
  { id: 4, name: "Payment from Diana", amount: 1200.0, pending: false, date: "2026-05-11" },
  { id: 5, name: "Subscription fee", amount: 15.99, pending: true, date: "2026-05-10" },
  { id: 6, name: "Payment from Eve", amount: 320.0, pending: false, date: "2026-05-09" },
  { id: 7, name: "Transfer to Frank", amount: 75.5, pending: true, date: "2026-05-08" },
  { id: 8, name: "Payment from Grace", amount: 1100.0, pending: false, date: "2026-05-07" },
  { id: 9, name: "Refund to Heidi", amount: 45.0, pending: true, date: "2026-05-06" },
  { id: 10, name: "Payment from Ivan", amount: 680.0, pending: false, date: "2026-05-05" },
  { id: 11, name: "Transfer to Judy", amount: 200.0, pending: true, date: "2026-05-04" },
  { id: 12, name: "Payment from Karl", amount: 950.0, pending: false, date: "2026-05-03" },
]

const PAGE_SIZE = 5

export default function Transactions() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(sampleTransactions.length / PAGE_SIZE)
  const paginated = sampleTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">View all your recent transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="text-left px-6 py-3 font-medium">Name</th>
                <th className="text-right px-6 py-3 font-medium">Amount</th>
                <th className="text-center px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((tx) => (
                <tr key={tx.id} className="border-b border-border hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium">{tx.name}</td>
                  <td className="px-6 py-4 text-right font-semibold">${tx.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={tx.pending ? "secondary" : "default"}>
                      {tx.pending ? "Pending" : "Completed"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
