"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Loader2, TrendingUp, Shirt } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const ADMIN_WALLET = "MQ6SC3572BRWP7U3PMBYQPR5TTL6HMY2GWNTMXS53VZDB6COVNO5TWQNCQ"

interface PaymentTransaction {
  txid: string
  amount: number
  receiver: string
  roundTime: number
}

interface TshirtPrintingData {
  loading: boolean
  error: string | null
  transactions: PaymentTransaction[]
  totalCount: number
  totalAlgos: number
  chartData: { date: string; amount: number; timestamp: number }[]
}

interface TshirtPrintingTrackerProps {
  showSummary?: boolean
  onTotalsChange?: (total: number) => void
}

export function TshirtPrintingTracker({ showSummary = false, onTotalsChange }: TshirtPrintingTrackerProps) {
  const [data, setData] = useState<TshirtPrintingData>({
    loading: true,
    error: null,
    transactions: [],
    totalCount: 0,
    totalAlgos: 0,
    chartData: [],
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://testnet-idx.4160.nodely.dev/v2/accounts/${ADMIN_WALLET}/transactions`)

        if (!response.ok) {
          throw new Error("Failed to fetch data for Tshirt Printing wallet")
        }

        const apiData = await response.json()

        const allTransactions = apiData.transactions || []
        const paymentTransactions: PaymentTransaction[] = allTransactions
          .filter((tx: any) => {
            return (
              tx["tx-type"] === "pay" &&
              tx.sender === ADMIN_WALLET &&
              tx["payment-transaction"] &&
              tx["payment-transaction"].receiver !== ADMIN_WALLET
            )
          })
          .map((tx: any) => ({
            txid: tx.id,
            amount: tx["payment-transaction"].amount,
            receiver: tx["payment-transaction"].receiver,
            roundTime: tx["round-time"],
          }))

        const totalAlgos = paymentTransactions.reduce((sum, tx) => sum + tx.amount / 1000000, 0)

        const chartData = paymentTransactions
          .sort((a, b) => a.roundTime - b.roundTime)
          .map((tx) => ({
            date: new Date(tx.roundTime * 1000).toLocaleDateString(),
            amount: tx.amount / 1000000,
            timestamp: tx.roundTime,
          }))

        setData({
          loading: false,
          error: null,
          transactions: paymentTransactions,
          totalCount: paymentTransactions.length,
          totalAlgos,
          chartData,
        })
      } catch (error) {
        setData({
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch data",
          transactions: [],
          totalCount: 0,
          totalAlgos: 0,
          chartData: [],
        })
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!data.loading && onTotalsChange) {
      onTotalsChange(data.totalCount)
    }
  }, [data.totalCount, data.loading, onTotalsChange])

  const formatAlgos = (microAlgos: number) => {
    return (microAlgos / 1000000).toFixed(2)
  }

  return (
    <div className="space-y-8">
      {showSummary && (
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#B8A4FF]/30 bg-background p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#B8A4FF] rounded-2xl shadow-lg">
                  <Shirt className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[#B8A4FF] rounded-full animate-pulse" />
                    Tshirt Printing Total
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Gas sponsorship for NFT minting</p>
                </div>
              </div>
              <div className="text-right">
                {data.loading ? (
                  <Loader2 className="h-10 w-10 animate-spin text-[#B8A4FF]" />
                ) : (
                  <>
                    <div className="text-5xl md:text-6xl font-black text-[#B8A4FF] tracking-tighter">
                      {data.totalCount}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">
                      {data.totalAlgos.toFixed(2)} ALGO sent
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <Card className="border border-border/50 hover:border-[#B8A4FF]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#B8A4FF]/10 bg-background rounded-2xl overflow-hidden">
          <CardHeader className="pb-4 bg-[#B8A4FF]/5">
            <div>
              <CardTitle className="text-xl font-bold mb-2 text-foreground tracking-tight">
                Admin Wallet (Gas Sponsorship)
              </CardTitle>
              <a
                href={`https://lora.algokit.io/testnet/account/${ADMIN_WALLET}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-muted-foreground hover:text-[#B8A4FF] transition-colors break-all leading-relaxed underline decoration-dotted underline-offset-2"
              >
                {ADMIN_WALLET}
              </a>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#B8A4FF]/10 rounded-xl border-2 border-[#B8A4FF]/30">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Transactions</p>
                {data.loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#B8A4FF]" />
                ) : (
                  <p className="text-3xl font-black text-[#B8A4FF] tracking-tight">{data.totalCount}</p>
                )}
              </div>
              <div className="p-4 bg-[#B8A4FF]/10 rounded-xl border-2 border-[#B8A4FF]/30">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">ALGO Sent</p>
                {data.loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-[#B8A4FF]" />
                ) : (
                  <p className="text-3xl font-black text-[#B8A4FF] tracking-tight">{data.totalAlgos.toFixed(2)}</p>
                )}
              </div>
            </div>

            {!data.loading && !data.error && data.chartData && data.chartData.length > 0 && (
              <div className="p-3 bg-muted/30 rounded-lg border">
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-[#B8A4FF]" />
                  Transaction History
                </h4>
                <ChartContainer
                  config={{
                    amount: {
                      label: "ALGO",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[200px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2.5}
                        dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                        activeDot={{ r: 6 }}
                        connectNulls={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Recent Payments
              </h4>

              {data.loading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {data.error && (
                <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                  {data.error}
                </div>
              )}

              {!data.loading && !data.error && data.transactions.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-6 bg-muted/30 rounded border">
                  No payment transactions found
                </div>
              )}

              {!data.loading && !data.error && data.transactions.length > 0 && (
                <div className="max-h-[300px] overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
                  {data.transactions.slice(0, 10).map((tx, index) => (
                    <a
                      key={tx.txid || index}
                      href={`https://lora.algokit.io/testnet/transaction/${tx.txid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 bg-muted/50 hover:bg-[#B8A4FF]/15 rounded-xl transition-all duration-200 border border-border/50 hover:border-[#B8A4FF]/50 hover:shadow-lg hover:shadow-[#B8A4FF]/10 group"
                    >
                      <div className="flex-1 mr-3 min-w-0">
                        <div className="font-mono text-xs text-foreground truncate font-medium mb-2">
                          {tx.txid ? `${tx.txid.slice(0, 8)}...${tx.txid.slice(-8)}` : "N/A"}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="secondary"
                            className="text-xs h-6 px-2.5 bg-[#B8A4FF]/15 text-[#B8A4FF] dark:text-[#C9B8FF] border border-[#B8A4FF]/40 font-semibold rounded-lg"
                          >
                            {formatAlgos(tx.amount)} ALGO
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono truncate">
                            to {tx.receiver.slice(0, 6)}...{tx.receiver.slice(-6)}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#B8A4FF] transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
