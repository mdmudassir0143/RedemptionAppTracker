"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Loader2, Package } from "lucide-react"

const swagItems = [
  {
    id: 1,
    accountAddress: "42M7ZWLS56IZUVRZCM4Q7QKBMKNYVFZOAJ6YKHS2TPOJQGQ2I4VYXSRZQU",
    title: "Summit Socks",
    description: "Comfortable socks with summit design",
  },
  {
    id: 2,
    accountAddress: "J4L6JX2HXENUNCSMHPXWV4J5QPSENJGQP6MDV37GSDI7QM4YMLNDHEHKOA",
    title: "Summit Diary & Pen",
    description: "Premium diary & Pen with Algorand India Summit branding",
  },
  {
    id: 3,
    accountAddress: "KAMFT3G45OARLQS6LMWP3J2FKMG3IC6HQ4UMSGFZIBUQTOQG7GNRRIIZMM",
    title: "Summit MousePad",
    description: "Elegant MousePad with Algorand branding",
  },
  {
    id: 4,
    accountAddress: "P4NWMYRUSHLDAHCHCK5GNZRGZ7I5TWAWWFQTGTYGBZ3ZQJGJAVTTG5P7RI",
    title: "Summit Cap",
    description: "Comfortable Cap with summit logo",
  },
  {
    id: 5,
    accountAddress: "2YBLB5FKMVKLYPKWKQZCW7HWFBXMV63S6PKVW4ZFMOVI64H5HIHNCPE4VU",
    title: "Summit Bottle",
    description: "Bottle with summit logo",
  },
    {
    id: 6,
    accountAddress: "AC4E5SXVSZHACMWRS2JCAA7QNKF3OFNTAFO6I4UMHJFJG5IQEULM7YZCTE",
    title: "Summit Hoodie",
    description: "Comfortable Hoodie with summit logo",
  },
      {
    id: 7,
    accountAddress: "ZLYIDLBSUYJZV4N77THCRKEOMO3G6VBPZNVGDOFPHJ5Z56YDYHHCDR7YPE",
    title: "Henna Tatoo",
    description: "Hennna Tatoo Deesign",
  },
      {
    id: 8,
    accountAddress: "XYEEBHGNIWQL5MTWHNRCXQC6RIDC6K3ZPLIPNJZWRFB5WESOJ735QZHFVM",
    title: "Sketch Shop",
    description: "Live Sketch at the summit",
  },
]

interface TransactionData {
  id: string
  "tx-type": string
  "round-time": number
  sender?: string
  "inner-txns"?: TransactionData[]
}

interface SwagData {
  loading: boolean
  error: string | null
  transactions: TransactionData[]
  totalCount: number
  innerTxCount: number
}

interface SwagTrackerProps {
  showSummary?: boolean
  onTotalsChange?: (total: number) => void
}

function countInnerTransactions(transactions: TransactionData[]): number {
  let count = 0
  for (const tx of transactions) {
    if (tx["inner-txns"] && tx["inner-txns"].length > 0) {
      count += tx["inner-txns"].length
      count += countInnerTransactions(tx["inner-txns"])
    }
  }
  return count
}

function flattenTransactions(
  transactions: TransactionData[],
  parentId?: string,
): Array<TransactionData & { isInner?: boolean; parentId?: string }> {
  const result: Array<TransactionData & { isInner?: boolean; parentId?: string }> = []

  for (const tx of transactions) {
    result.push({ ...tx, isInner: !!parentId, parentId })

    if (tx["inner-txns"] && tx["inner-txns"].length > 0) {
      result.push(...flattenTransactions(tx["inner-txns"], tx.id))
    }
  }

  return result
}

const transactionTypeMap: Record<string, string> = {
  pay: "Payment",
  axfer: "Asset Transfer",
  acfg: "Asset Config",
  afrz: "Asset Freeze",
  appl: "Application Call",
  keyreg: "Key Registration",
}

function countTransactionsByType(transactions: TransactionData[]): Record<string, number> {
  const counts: Record<string, number> = {}

  function processTransaction(tx: TransactionData) {
    const txType = tx["tx-type"]
    counts[txType] = (counts[txType] || 0) + 1

    // Process inner transactions recursively
    if (tx["inner-txns"] && tx["inner-txns"].length > 0) {
      tx["inner-txns"].forEach(processTransaction)
    }
  }

  transactions.forEach(processTransaction)
  return counts
}

function getTransactionTypeName(txType: string): string {
  return transactionTypeMap[txType] || txType
}

export function SwagTracker({ showSummary = false, onTotalsChange }: SwagTrackerProps) {
  const [swagData, setSwagData] = useState<Record<string, SwagData>>({})

  useEffect(() => {
    const initialState: Record<string, SwagData> = {}
    swagItems.forEach((item) => {
      initialState[item.accountAddress] = {
        loading: true,
        error: null,
        transactions: [],
        totalCount: 0,
        innerTxCount: 0,
      }
    })
    setSwagData(initialState)

    swagItems.forEach(async (item) => {
      try {
        const response = await fetch(
          `https://mainnet-idx.4160.nodely.dev/v2/accounts/${item.accountAddress}/transactions`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${item.title}`)
        }

        const data = await response.json()

        const transactions: TransactionData[] = data.transactions || []
        const innerTxCount = countInnerTransactions(transactions)

        setSwagData((prev) => ({
          ...prev,
          [item.accountAddress]: {
            loading: false,
            error: null,
            transactions: transactions,
            totalCount: transactions.length,
            innerTxCount: innerTxCount,
          },
        }))
      } catch (error) {
        setSwagData((prev) => ({
          ...prev,
          [item.accountAddress]: {
            loading: false,
            error: error instanceof Error ? error.message : "Failed to fetch data",
            transactions: [],
            totalCount: 0,
            innerTxCount: 0,
          },
        }))
      }
    })
  }, [])

  const totalTransactions = Object.values(swagData).reduce((sum, data) => sum + (data?.totalCount || 0), 0)
  const totalInnerTransactions = Object.values(swagData).reduce((sum, data) => sum + (data?.innerTxCount || 0), 0)
  const isAnyLoading = Object.values(swagData).some((data) => data?.loading)

  const combinedTypeCounts = Object.values(swagData).reduce(
    (acc, data) => {
      if (data?.transactions) {
        const typeCounts = countTransactionsByType(data.transactions)
        Object.entries(typeCounts).forEach(([type, count]) => {
          acc[type] = (acc[type] || 0) + count
        })
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort by count descending
  const sortedTypeCounts = Object.entries(combinedTypeCounts).sort(([, a], [, b]) => b - a)

  useEffect(() => {
    if (!isAnyLoading && onTotalsChange) {
      const combinedTotal = totalTransactions + totalInnerTransactions
      onTotalsChange(combinedTotal)
    }
  }, [totalTransactions, totalInnerTransactions, isAnyLoading, onTotalsChange])

  useEffect(() => {
    if (!isAnyLoading) {
      console.log("Swag Items Total:", {
        topLevel: totalTransactions,
        inner: totalInnerTransactions,
        combined: totalTransactions + totalInnerTransactions,
      })
    }
  }, [totalTransactions, totalInnerTransactions, isAnyLoading])

  return (
    <div className="space-y-8">
      {showSummary && (
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#4E62FF]/30 bg-background p-7 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#4E62FF] rounded-2xl shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[#4E62FF] rounded-full animate-pulse" />
                    Service Transactions
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Combined across all services</p>
                </div>
              </div>
              {isAnyLoading ? (
                <Loader2 className="h-10 w-10 animate-spin text-[#4E62FF]" />
              ) : (
                <div className="text-5xl md:text-6xl font-black text-[#4E62FF] tracking-tighter">
                  {totalTransactions + totalInnerTransactions}
                </div>
              )}
            </div>

            {!isAnyLoading && sortedTypeCounts.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">Transactions by Type</h3>
                <div className="space-y-0 overflow-hidden rounded-lg border border-border/50">
                  <div className="grid grid-cols-2 bg-muted/50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <div>Transaction Type</div>
                    <div className="text-right">Count</div>
                  </div>
                  {sortedTypeCounts.map(([type, count], index) => (
                    <div
                      key={type}
                      className={`grid grid-cols-2 px-4 py-3 text-sm ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/30"
                      } hover:bg-[#4E62FF]/5 transition-colors`}
                    >
                      <div className="font-medium text-foreground">{transactionTypeMap[type] || type}</div>
                      <div className="text-right font-bold text-[#4E62FF]">{count.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {swagItems.map((item) => {
            const data = swagData[item.accountAddress]
            const allTransactions = data?.transactions ? flattenTransactions(data.transactions) : []

            return (
              <Card
                key={item.id}
                className="border border-border/50 hover:border-[#4E62FF]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#4E62FF]/10 bg-background rounded-2xl overflow-hidden"
              >
                <CardHeader className="pb-5 space-y-3 bg-[#4E62FF]/5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-foreground mb-2 tracking-tight">
                        {item.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                    <a
                      href={`https://lora.algokit.io/mainnet/account/${item.accountAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      title={`View account: ${item.accountAddress}`}
                    >
                      <Badge
                        variant="secondary"
                        className="font-mono text-[10px] px-3 py-1.5 bg-[#4E62FF]/10 text-[#4E62FF] dark:text-[#6B7FFF] border border-[#4E62FF]/30 group-hover:bg-[#4E62FF]/20 group-hover:border-[#4E62FF]/50 group-hover:shadow-lg group-hover:shadow-[#4E62FF]/20 transition-all duration-200 cursor-pointer rounded-lg"
                      >
                        {item.accountAddress.slice(0, 4)}...{item.accountAddress.slice(-4)}
                      </Badge>
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="p-5 bg-[#4E62FF]/10 rounded-xl border-2 border-[#4E62FF]/30">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Total Transactions
                    </p>
                    {data?.loading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-[#4E62FF]" />
                    ) : (
                      <div>
                        <p className="text-4xl font-black text-[#4E62FF] tracking-tight">
                          {(data?.totalCount || 0) + (data?.innerTxCount || 0)}
                        </p>
                        {data?.innerTxCount > 0 && (
                          <p className="text-xs text-muted-foreground mt-2 font-medium">
                            {data.totalCount} top-level + {data.innerTxCount} inner
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                      Recent Transactions
                    </h4>

                    {data?.loading && (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    )}

                    {data?.error && (
                      <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                        {data.error}
                      </div>
                    )}

                    {!data?.loading && !data?.error && allTransactions.length === 0 && (
                      <div className="text-xs text-muted-foreground text-center py-6 bg-muted/30 rounded border">
                        No transactions found
                      </div>
                    )}

                    {!data?.loading && !data?.error && allTransactions.length > 0 && (
                      <div className="max-h-[240px] overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
                        {allTransactions.slice(0, 15).map((tx, index) => {
                          const displayId = tx.isInner ? tx.parentId : tx.id
                          const linkId = tx.parentId || tx.id
                          const txTypeName = getTransactionTypeName(tx["tx-type"])

                          return (
                            <a
                              key={`${tx.id || tx.parentId}-${index}`}
                              href={`https://lora.algokit.io/mainnet/transaction/${linkId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center justify-between p-3.5 bg-muted/50 hover:bg-[#4E62FF]/15 rounded-xl transition-all duration-200 border border-border/50 hover:border-[#4E62FF]/50 hover:shadow-lg hover:shadow-[#4E62FF]/10 group ${
                                tx.isInner ? "ml-4 border-l-4 border-l-[#B8A4FF]/70" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-2.5 py-1 h-6 shrink-0 font-semibold rounded-lg ${
                                    tx.isInner
                                      ? "bg-[#B8A4FF]/15 text-[#B8A4FF] dark:text-[#C9B8FF] border-[#B8A4FF]/40"
                                      : "bg-[#4E62FF]/15 text-[#4E62FF] dark:text-[#6B7FFF] border-[#4E62FF]/40"
                                  }`}
                                >
                                  {tx.isInner ? "Inner " : ""}
                                  {txTypeName}
                                </Badge>
                                <span className="font-mono text-xs text-foreground truncate font-medium">
                                  {displayId ? `${displayId.slice(0, 6)}...${displayId.slice(-6)}` : "N/A"}
                                </span>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-[#4E62FF] transition-colors shrink-0 ml-3" />
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
