"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertySearch from "./property-search"
import DevelopmentCalculator from "./development-calculator"
import ZoningComparison from "./zoning-comparison"
import MarketAnalysisDashboard from "./market-analysis/market-analysis-dashboard"
import SubscriptionPlans from "./subscription-plans"
import { zoningData } from "@/lib/zoning-data"
// Import the new component
import ApprovalTimelineForecaster from "./approval-timeline/approval-timeline-forecaster"

export default function PremiumFeaturesShowcase() {
  const [activeTab, setActiveTab] = useState("market-analysis")

  // For demo purposes, we'll use the first zoning entry
  const demoZoning = zoningData[0]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Premium Developer Tools</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="property-search">Property Search</TabsTrigger>
          <TabsTrigger value="market-analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="development-calculator">Development Calculator</TabsTrigger>
          <TabsTrigger value="zoning-comparison">Zoning Comparison</TabsTrigger>
          <TabsTrigger value="approval-timeline">Approval Timeline</TabsTrigger>
          <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="property-search" className="mt-0">
          <PropertySearch />
        </TabsContent>

        <TabsContent value="market-analysis" className="mt-0">
          <MarketAnalysisDashboard zoning={demoZoning} isPremium={true} />
        </TabsContent>

        <TabsContent value="development-calculator" className="mt-0">
          <DevelopmentCalculator zoning={demoZoning} isPremium={true} />
        </TabsContent>

        <TabsContent value="zoning-comparison" className="mt-0">
          <ZoningComparison />
        </TabsContent>

        <TabsContent value="approval-timeline" className="mt-0">
          <ApprovalTimelineForecaster isPremium={true} />
        </TabsContent>

        <TabsContent value="subscription" className="mt-0">
          <SubscriptionPlans />
        </TabsContent>
      </Tabs>
    </div>
  )
}
