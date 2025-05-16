"use client"

import { useState } from "react"
import { DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import RentalCompsTable from "./rental-comps-table"
import SalesCompsTable from "./sales-comps-table"
import MarketTrendsChart from "./market-trends-chart"
import CompsMap from "./comps-map"
import FinancialFeasibilityCalculator from "./financial-feasibility-calculator"
import { rentalCompsData, salesCompsData } from "@/lib/market-data"
import type { ZoningInfo } from "@/lib/types"

interface MarketAnalysisDashboardProps {
  zoning: ZoningInfo
  isPremium: boolean
}

export default function MarketAnalysisDashboard({ zoning, isPremium }: MarketAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [propertyType, setPropertyType] = useState("single-family")
  const [radius, setRadius] = useState(1.0)
  const [timeFrame, setTimeFrame] = useState("6")

  // Filter comps based on property type and radius
  // In a real app, this would be a more sophisticated filtering system
  const filteredRentalComps = rentalCompsData.filter(
    (comp) => comp.propertyType === propertyType && comp.distanceFromTarget <= radius,
  )

  const filteredSalesComps = salesCompsData.filter(
    (comp) => comp.propertyType === propertyType && comp.distanceFromTarget <= radius,
  )

  // Calculate average metrics for the overview
  const avgRentalPrice =
    filteredRentalComps.reduce((sum, comp) => sum + comp.pricePerSqFt, 0) / filteredRentalComps.length
  const avgSalePrice = filteredSalesComps.reduce((sum, comp) => sum + comp.pricePerSqFt, 0) / filteredSalesComps.length
  const avgCapRate =
    filteredSalesComps.reduce((sum, comp) => sum + (comp.capRate || 0), 0) /
    filteredSalesComps.filter((comp) => comp.capRate !== undefined).length

  if (!isPremium) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Market Analysis & Financial Feasibility
          </CardTitle>
          <CardDescription>
            Access rental and sales comparables to analyze the financial feasibility of development projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-3">
            <DollarSign className="h-16 w-16 mx-auto text-gray-300" />
            <h3 className="text-lg font-medium">Premium Feature</h3>
            <p className="text-sm text-gray-500 max-w-md">
              Unlock market analysis tools to access rental and sales comparables, market trends, and financial
              feasibility calculations for your development projects.
            </p>
          </div>
          <Button className="mt-6">Upgrade to Pro</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Market Analysis & Financial Feasibility
        </CardTitle>
        <CardDescription>
          Access rental and sales comparables to analyze the financial feasibility of development projects in{" "}
          {zoning.city}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="property-type">Property Type</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger id="property-type">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-family">Single Family Home</SelectItem>
                <SelectItem value="multi-family">Multi-Family</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="condo">Condominium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="radius">Search Radius</Label>
              <span className="text-sm font-medium">{radius.toFixed(1)} miles</span>
            </div>
            <Slider
              id="radius"
              min={0.5}
              max={5}
              step={0.5}
              value={[radius]}
              onValueChange={(value) => setRadius(value[0])}
            />
          </div>

          <div>
            <Label htmlFor="time-frame">Time Frame</Label>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger id="time-frame">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Last 3 months</SelectItem>
                <SelectItem value="6">Last 6 months</SelectItem>
                <SelectItem value="12">Last 12 months</SelectItem>
                <SelectItem value="24">Last 24 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Average Rental Rate</p>
                <p className="text-3xl font-bold">${avgRentalPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500">per sq ft / month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Average Sale Price</p>
                <p className="text-3xl font-bold">${avgSalePrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500">per sq ft</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Average Cap Rate</p>
                <p className="text-3xl font-bold">{avgCapRate.toFixed(2)}%</p>
                <p className="text-xs text-gray-500">for investment properties</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rental">Rental Comps</TabsTrigger>
            <TabsTrigger value="sales">Sales Comps</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="feasibility">Feasibility</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Market Trends</CardTitle>
                  <CardDescription>Price trends over the past {timeFrame} months</CardDescription>
                </CardHeader>
                <CardContent>
                  <MarketTrendsChart timeFrame={Number.parseInt(timeFrame)} propertyType={propertyType} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Market Snapshot</CardTitle>
                  <CardDescription>Current market conditions in {zoning.city}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Median Days on Market</p>
                        <p className="text-xl font-bold">18 days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Inventory</p>
                        <p className="text-xl font-bold">2.1 months</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Year-over-Year Change</p>
                        <p className="text-xl font-bold text-green-600">+8.3%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price to List Ratio</p>
                        <p className="text-xl font-bold">102%</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Market Insights</h4>
                      <p className="text-sm text-gray-600">
                        The {zoning.city} market for {propertyType.replace("-", " ")} properties shows strong demand
                        with limited inventory. Properties are selling above asking price with a median of 18 days on
                        market, indicating a seller's market. Rental rates have increased 5.2% year-over-year,
                        suggesting strong rental demand.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Development Opportunity Analysis</CardTitle>
                <CardDescription>Financial metrics for potential development in this zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Potential Gross Yield</p>
                    <p className="text-2xl font-bold">5.8%</p>
                    <p className="text-xs text-gray-500">Based on current rental rates</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Construction Cost Index</p>
                    <p className="text-2xl font-bold">142.3</p>
                    <p className="text-xs text-gray-500">Relative to national average (100)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price to Replacement Cost</p>
                    <p className="text-2xl font-bold">1.24x</p>
                    <p className="text-xs text-gray-500">Market value vs. construction cost</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Development Feasibility Score</p>
                    <p className="text-2xl font-bold text-green-600">7.2/10</p>
                    <p className="text-xs text-gray-500">Based on market conditions and zoning</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rental">
            <RentalCompsTable comps={filteredRentalComps} />
          </TabsContent>

          <TabsContent value="sales">
            <SalesCompsTable comps={filteredSalesComps} />
          </TabsContent>

          <TabsContent value="map">
            <CompsMap
              rentalComps={filteredRentalComps}
              salesComps={filteredSalesComps}
              centerLat={zoning.coordinates.lat}
              centerLng={zoning.coordinates.lng}
            />
          </TabsContent>

          <TabsContent value="feasibility">
            <FinancialFeasibilityCalculator
              zoning={zoning}
              avgRentalRate={avgRentalPrice}
              avgSalePrice={avgSalePrice}
              avgCapRate={avgCapRate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
