"use client"

import { SwagTracker } from "@/components/swag-tracker"
import { VolunteerTracker } from "@/components/volunteer-tracker"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Package, Users } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [swagTotal, setSwagTotal] = useState(0)
  const [volunteerTotal, setVolunteerTotal] = useState(0)

  const grandTotal = swagTotal + volunteerTotal

  return (
    <main className="min-h-screen bg-background">
      <ThemeToggle />

      <div className="border-b border-border/40 bg-gradient-to-r from-background via-[#4E62FF]/5 to-background backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent via-[#4E62FF] to-transparent rounded-full" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-[#4E62FF] to-foreground bg-clip-text text-transparent tracking-tight">
                Reward Redemption App Tracker
              </h1>
              <div className="h-1 w-16 bg-gradient-to-r from-transparent via-[#4E62FF] to-transparent rounded-full" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tracking Services and Volunteer Activity at Algorand India Summit.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative overflow-hidden rounded-2xl border border-[#4E62FF]/20 bg-background from-[#4E62FF]/10 via-background to-[#00D4D4]/10 p-8 shadow-2xl shadow-[#4E62FF]/10 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl -z-10" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#4E62FF] from-[#4E62FF] via-[#4E62FF] to-[#00D4D4] rounded-2xl shadow-xl shadow-[#4E62FF]/20">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[#4E62FF] rounded-full animate-pulse" />
                    Total Transactions
                  </p>
                  <p className="text-sm text-muted-foreground/80 font-medium">
                    Service Requests ({swagTotal}) + Volunteer Payments ({volunteerTotal})
                  </p>
                </div>
              </div>
              <div className="text-6xl md:text-7xl font-black bg-[#4E62FF] from-[#4E62FF] via-[#4E62FF] to-[#00D4D4] bg-clip-text text-transparent tracking-tighter">
                {grandTotal}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="swag" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-10 h-14 bg-muted/50 p-1.5 rounded-2xl border border-border/40 shadow-lg">
            <TabsTrigger
              value="swag"
              className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#4E62FF]/20 data-[state=active]:to-[#4E62FF]/10 data-[state=active]:border data-[state=active]:border-[#4E62FF]/40 data-[state=active]:shadow-lg data-[state=active]:shadow-[#4E62FF]/20 transition-all duration-300"
            >
              <Package className="h-4 w-4 mr-2" />
              Service Tracker
            </TabsTrigger>
            <TabsTrigger
              value="volunteer"
              className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#00D4D4]/20 data-[state=active]:to-[#00D4D4]/10 data-[state=active]:border data-[state=active]:border-[#00D4D4]/40 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00D4D4]/20 transition-all duration-300"
            >
              <Users className="h-4 w-4 mr-2" />
              Volunteer Tracker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="swag" className="mt-0">
            <SwagTracker showSummary={true} onTotalsChange={setSwagTotal} />
          </TabsContent>

          <TabsContent value="volunteer" className="mt-0">
            <VolunteerTracker showSummary={true} onTotalsChange={setVolunteerTotal} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
