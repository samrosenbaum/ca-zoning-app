"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PropertySearch from "./property-search"
import DevelopmentCalculator from "./development-calculator"
import ZoningComparison from "./zoning-comparison"
import SubscriptionPlans from "./subscription-plans"
import { zoningData } from "@/lib/zoning-data"

export default function PremiumFeaturesShowcase() {
  const [activeTab, setActiveTab] = useState("property-search")

  // For demo purposes, we'll use the first zoning entry
  const demoZoning = zoningData[0]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Premium Developer Tools</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="property-search">Property Search</TabsTrigger>
          <TabsTrigger value="development-calculator">Development Calculator</TabsTrigger>
          <TabsTrigger value="zoning-comparison">Zoning Comparison</TabsTrigger>
          <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="property-search" className="mt-0">
          <PropertySearch />
        </TabsContent>

        <TabsContent value="development-calculator" className="mt-0">
          <DevelopmentCalculator zoning={demoZoning} isPremium={true} />
        </TabsContent>

        <TabsContent value="zoning-comparison" className="mt-0">
          <ZoningComparison />
        </TabsContent>

        <TabsContent value="subscription" className="mt-0">
          <SubscriptionPlans />
        </TabsContent>
      </Tabs>
    </div>
  )
}
