"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Loader2, Wallet } from "lucide-react"

const volunteerBalanceAccounts = [
  { name: "Post Office Wallet1 Balance", address: "D52U3HFDWJIX54T26AYUDZU3DROVSPPESYI3CMXCTHTQU5DXIFH2HAFOSY" },
  { name: "Post Office Wallet1 Balance", address: "YBQ4CMXQVDFLMFZFB5JNPPXU33MNIJCJPT2TGYS6GJR2ATMJRPWHQ3LTQQ" },
  { name: "Algo Dukan 1 Wallet Balance", address: "QFCTF632VWA5MGEF74Z6ELBUZDJFOHR276RPGQFE44RDNCEBVM465FZHFE" },
  { name: "Algo Dukan 2 Wallet Balance", address: "BFJOBKLJADVJ7WJB2B2DOM2M3HCR6CNO3V7I2FCKG7NTTVFCETGKSBDPZA" },
  { name: "Henna Tatoo Balance", address: "CA4MUY7F6JOCRUZWYGDBVRB5IMJU6BDUESLHJBHDOHCCSQBKPKVG76LV2U" },
  { name: "Sketch Shop Balance", address: "IV4QAZ3CFMDEKEOBNB7YPWLFGGLDUF3QQVSZPECBGOFMOHRKZRSW45AVAU" },
]

interface AccountBalance {
  loading: boolean
  error: string | null
  balance: number
}

interface VolunteerBalanceTrackerProps {
  showSummary?: boolean
}

export function VolunteerBalanceTracker({ showSummary = false }: VolunteerBalanceTrackerProps) {
  const [balanceData, setBalanceData] = useState<Record<string, AccountBalance>>({})

  const totalBalance = Object.values(balanceData).reduce((sum, data) => sum + (data?.balance || 0), 0)
  const isAnyLoading = Object.values(balanceData).some((data) => data?.loading)

  useEffect(() => {
    const initialState: Record<string, AccountBalance> = {}
    volunteerBalanceAccounts.forEach((account) => {
      initialState[account.address] = {
        loading: true,
        error: null,
        balance: 0,
      }
    })
    setBalanceData(initialState)

    volunteerBalanceAccounts.forEach(async (account) => {
      try {
        const response = await fetch(`https://mainnet-idx.4160.nodely.dev/v2/accounts/${account.address}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch balance for ${account.name}`)
        }

        const data = await response.json()

        const balanceInAlgos = (data.account?.amount || 0) / 1000000

        setBalanceData((prev) => ({
          ...prev,
          [account.address]: {
            loading: false,
            error: null,
            balance: balanceInAlgos,
          },
        }))
      } catch (error) {
        setBalanceData((prev) => ({
          ...prev,
          [account.address]: {
            loading: false,
            error: error instanceof Error ? error.message : "Failed to fetch balance",
            balance: 0,
          },
        }))
      }
    })
  }, [])

  return (
    <div className="space-y-8">
      {showSummary && (
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#00D4D4]/30 bg-background p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#00D4D4] rounded-2xl shadow-lg">
                  <Wallet className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[#00D4D4] rounded-full animate-pulse" />
                    Volunteer Balance Total
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Combined wallet balances on mainnet</p>
                </div>
              </div>
              <div className="text-right">
                {isAnyLoading ? (
                  <Loader2 className="h-10 w-10 animate-spin text-[#00D4D4]" />
                ) : (
                  <>
                    <div className="text-5xl md:text-6xl font-black text-[#00D4D4] tracking-tighter">
                      {totalBalance.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">ALGO</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {volunteerBalanceAccounts.map((account) => {
            const data = balanceData[account.address]

            return (
              <Card
                key={account.address}
                className="border border-border/50 hover:border-[#00D4D4]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00D4D4]/10 bg-background rounded-2xl overflow-hidden"
              >
                <CardHeader className="pb-4 bg-[#00D4D4]/5">
                  <div>
                    <CardTitle className="text-xl font-bold mb-2 text-foreground tracking-tight">
                      {account.name}
                    </CardTitle>
                    <a
                      href={`https://lora.algokit.io/mainnet/account/${account.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-muted-foreground hover:text-[#00D4D4] transition-colors break-all leading-relaxed underline decoration-dotted underline-offset-2 inline-flex items-center gap-2"
                    >
                      {account.address}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="p-6 bg-[#00D4D4]/10 rounded-xl border-2 border-[#00D4D4]/30 text-center">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                      Current Balance
                    </p>
                    {data?.loading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-[#00D4D4] mx-auto" />
                    ) : data?.error ? (
                      <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                        {data.error}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-4xl md:text-5xl font-black text-[#00D4D4] tracking-tight">
                          {data?.balance.toFixed(2)}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-sm h-7 px-3 bg-[#B8A4FF]/15 text-[#B8A4FF] dark:text-[#C9B8FF] border border-[#B8A4FF]/40 font-semibold rounded-lg"
                        >
                          ALGO
                        </Badge>
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
