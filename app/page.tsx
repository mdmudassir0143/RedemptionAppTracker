"use client"

import { SwagTracker } from "@/components/swag-tracker"
import { VolunteerTracker } from "@/components/volunteer-tracker"
import { TshirtPrintingTracker } from "@/components/tshirt-printing-tracker"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Package, Users, Shirt } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [swagTotal, setSwagTotal] = useState(0)
  const [volunteerTotal, setVolunteerTotal] = useState(0)
  const [tshirtTotal, setTshirtTotal] = useState(0)
  const [activeTab, setActiveTab] = useState("swag")

  const grandTotal = swagTotal + volunteerTotal + tshirtTotal

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
              Tracking Services, Volunteer and Admin Activities at Algorand India Summit.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative overflow-hidden rounded-2xl border border-[#4E62FF]/20 bg-background from-[#4E62FF]/10 via-background to-[#00D4D4]/10 p-8 shadow-2xl shadow-[#4E62FF]/10 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3 sm:p-4 bg-[#4E62FF] from-[#4E62FF] via-[#4E62FF] to-[#00D4D4] rounded-2xl shadow-xl shadow-[#4E62FF]/20 shrink-0">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[#4E62FF] rounded-full animate-pulse" />
                    Total Transactions
                  </p>
                  <div className="text-xs sm:text-sm text-muted-foreground/80 font-medium space-y-1 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-1">
                      <span className="whitespace-nowrap">Service Requests ({swagTotal})</span>
                      <span className="hidden sm:inline">+</span>
                      <span className="whitespace-nowrap">Volunteer Payments ({volunteerTotal})</span>
                      <span className="hidden sm:inline">+</span>
                      <span className="whitespace-nowrap">NFT Printing ({tshirtTotal})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-5xl sm:text-6xl md:text-7xl font-black bg-[#4E62FF] from-[#4E62FF] via-[#4E62FF] to-[#00D4D4] bg-clip-text text-transparent tracking-tighter text-center sm:text-right shrink-0">
                {grandTotal}
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-col sm:grid sm:grid-cols-3 w-full max-w-2xl mx-auto gap-2 sm:gap-0 mb-10 h-auto sm:h-14 bg-muted/50 p-1.5 rounded-2xl border border-border/40 shadow-lg">
            <TabsTrigger
              value="swag"
              className="text-sm font-semibold rounded-xl data-[state=active]:bg-[#4E62FF]/20 data-[state=active]:border-2 data-[state=active]:border-[#4E62FF]/50 data-[state=active]:shadow-lg transition-all duration-300 w-full justify-center py-3 sm:py-0"
            >
              <Package className="h-4 w-4 mr-2" />
              Service Tracker
            </TabsTrigger>
            <TabsTrigger
              value="volunteer"
              className="text-sm font-semibold rounded-xl data-[state=active]:bg-[#00D4D4]/20 data-[state=active]:border-2 data-[state=active]:border-[#00D4D4]/50 data-[state=active]:shadow-lg transition-all duration-300 w-full justify-center py-3 sm:py-0"
            >
              <Users className="h-4 w-4 mr-2" />
              PostOffice Tracker
            </TabsTrigger>
            <TabsTrigger
              value="tshirt"
              className="text-sm font-semibold rounded-xl data-[state=active]:bg-[#4E62FF]/20 data-[state=active]:border-2 data-[state=active]:border-[#4E62FF]/50 data-[state=active]:shadow-lg transition-all duration-300 w-full justify-center py-3 sm:py-0"
            >
              <Shirt className="h-4 w-4 mr-2" />
              NFT Printing Tracker
            </TabsTrigger>
          </TabsList>

          <div className={activeTab === "swag" ? "block" : "hidden"}>
            <SwagTracker showSummary={true} onTotalsChange={setSwagTotal} />
          </div>

          <div className={activeTab === "volunteer" ? "block" : "hidden"}>
            <VolunteerTracker showSummary={true} onTotalsChange={setVolunteerTotal} />
          </div>

          <div className={activeTab === "tshirt" ? "block" : "hidden"}>
            <TshirtPrintingTracker showSummary={true} onTotalsChange={setTshirtTotal} />
          </div>
        </Tabs>
      </div>
    </main>
  )
}
