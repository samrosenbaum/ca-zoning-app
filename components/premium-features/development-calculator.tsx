"use client"

import { useState } from "react"
import { Calculator, Building, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { ZoningInfo } from "@/lib/types"

interface DevelopmentCalculatorProps {
  zoning: ZoningInfo
  isPremium: boolean
}

export default function DevelopmentCalculator({ zoning, isPremium }: DevelopmentCalculatorProps) {
  const [lotSize, setLotSize] = useState(zoning.minLotSize)
  const [buildingHeight, setBuildingHeight] = useState(zoning.maxHeight)
  const [coveragePercent, setCoveragePercent] = useState(zoning.maxCoverage)
  const [stories, setStories] = useState(zoning.maxStories)
  const [constructionCost, setConstructionCost] = useState(250) // per sq ft
  const [rentalRate, setRentalRate] = useState(3.5) // per sq ft per month
  const [capRate, setCapRate] = useState(5.0) // percentage

  // Calculate development metrics
  const maxBuildableArea = lotSize * (coveragePercent / 100) * stories
  const totalConstructionCost = maxBuildableArea * constructionCost
  const annualRentalIncome = maxBuildableArea * rentalRate * 12
  const propertyValue = annualRentalIncome / (capRate / 100)
  const roi = ((propertyValue - totalConstructionCost) / totalConstructionCost) * 100

  if (!isPremium) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Development Potential Calculator
          </CardTitle>
          <CardDescription>
            Analyze the development potential and financial feasibility of properties under this zoning.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-3">
            <Building className="h-16 w-16 mx-auto text-gray-300" />
            <h3 className="text-lg font-medium">Premium Feature</h3>
            <p className="text-sm text-gray-500 max-w-md">
              Unlock our development calculator to analyze buildable area, construction costs, and potential ROI based
              on zoning constraints.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button>Upgrade to Pro</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Development Potential Calculator
        </CardTitle>
        <CardDescription>
          Analyze the development potential and financial feasibility of properties under this zoning.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="physical">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="physical">Physical Constraints</TabsTrigger>
            <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="physical" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lot-size">Lot Size (sq ft)</Label>
                <span className="text-sm font-medium">{lotSize.toLocaleString()}</span>
              </div>
              <Slider
                id="lot-size"
                min={zoning.minLotSize}
                max={zoning.minLotSize * 5}
                step={100}
                value={[lotSize]}
                onValueChange={(value) => setLotSize(value[0])}
              />
              <p className="text-xs text-gray-500">Minimum lot size: {zoning.minLotSize.toLocaleString()} sq ft</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="building-height">Building Height (ft)</Label>
                <span className="text-sm font-medium">{buildingHeight}</span>
              </div>
              <Slider
                id="building-height"
                min={10}
                max={zoning.maxHeight}
                step={1}
                value={[buildingHeight]}
                onValueChange={(value) => setBuildingHeight(value[0])}
              />
              <p className="text-xs text-gray-500">Maximum height: {zoning.maxHeight} ft</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="coverage">Lot Coverage (%)</Label>
                <span className="text-sm font-medium">{coveragePercent}%</span>
              </div>
              <Slider
                id="coverage"
                min={10}
                max={zoning.maxCoverage}
                step={1}
                value={[coveragePercent]}
                onValueChange={(value) => setCoveragePercent(value[0])}
              />
              <p className="text-xs text-gray-500">Maximum coverage: {zoning.maxCoverage}%</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="stories">Number of Stories</Label>
                <span className="text-sm font-medium">{stories}</span>
              </div>
              <Slider
                id="stories"
                min={1}
                max={zoning.maxStories}
                step={1}
                value={[stories]}
                onValueChange={(value) => setStories(value[0])}
              />
              <p className="text-xs text-gray-500">Maximum stories: {zoning.maxStories}</p>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="construction-cost">Construction Cost ($/sq ft)</Label>
                <Input
                  id="construction-cost"
                  type="number"
                  value={constructionCost}
                  onChange={(e) => setConstructionCost(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500">Typical range: $200-$400 per sq ft</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rental-rate">Rental Rate ($/sq ft/month)</Label>
                <Input
                  id="rental-rate"
                  type="number"
                  step="0.1"
                  value={rentalRate}
                  onChange={(e) => setRentalRate(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500">Current market average for {zoning.city}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cap-rate">Cap Rate (%)</Label>
                <Input
                  id="cap-rate"
                  type="number"
                  step="0.1"
                  value={capRate}
                  onChange={(e) => setCapRate(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500">Typical range: 4%-7%</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Physical Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Building Footprint:</span>
                      <span className="font-medium">
                        {Math.floor(lotSize * (coveragePercent / 100)).toLocaleString()} sq ft
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Buildable Area:</span>
                      <span className="font-medium">{Math.floor(maxBuildableArea).toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Floor Area Ratio (FAR):</span>
                      <span className="font-medium">{(maxBuildableArea / lotSize).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Financial Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Construction Cost:</span>
                      <span className="font-medium">${Math.floor(totalConstructionCost).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Annual Rental Income:</span>
                      <span className="font-medium">${Math.floor(annualRentalIncome).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estimated Property Value:</span>
                      <span className="font-medium">${Math.floor(propertyValue).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center bg-gray-50 p-6 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Estimated Return on Investment</div>
                  <div className="text-4xl font-bold text-blue-600">{roi.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500 mt-2">Based on current inputs and market conditions</div>
                </div>

                <div className="w-full mt-6">
                  <div className="text-sm font-medium mb-2">ROI Rating</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        roi < 10 ? "bg-red-500" : roi < 20 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(roi * 2, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                Generate Detailed Financial Report
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
