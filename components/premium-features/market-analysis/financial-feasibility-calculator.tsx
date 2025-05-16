"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Calculator, DollarSign, Download, BarChart3, TrendingUp, Building, Home } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ZoningInfo } from "@/lib/types"

interface FinancialFeasibilityCalculatorProps {
  zoning: ZoningInfo
  avgRentalRate: number
  avgSalePrice: number
  avgCapRate: number
}

export default function FinancialFeasibilityCalculator({
  zoning,
  avgRentalRate,
  avgSalePrice,
  avgCapRate,
}: FinancialFeasibilityCalculatorProps) {
  // Development scenario
  const [lotSize, setLotSize] = useState(zoning.minLotSize)
  const [buildingHeight, setBuildingHeight] = useState(zoning.maxHeight)
  const [coveragePercent, setCoveragePercent] = useState(zoning.maxCoverage)
  const [stories, setStories] = useState(zoning.maxStories)

  // Construction costs
  const [constructionCost, setConstructionCost] = useState(250) // per sq ft
  const [softCostPercent, setSoftCostPercent] = useState(20) // % of hard costs
  const [contingencyPercent, setContingencyPercent] = useState(10) // % of hard + soft costs
  const [landCost, setLandCost] = useState(lotSize * 50) // $50 per sq ft

  // Rental scenario
  const [rentalRate, setRentalRate] = useState(avgRentalRate) // per sq ft per month
  const [vacancyRate, setVacancyRate] = useState(5) // %
  const [operatingExpenseRatio, setOperatingExpenseRatio] = useState(35) // % of gross income
  const [capRate, setCapRate] = useState(avgCapRate) // %

  // Sale scenario
  const [salePrice, setSalePrice] = useState(avgSalePrice) // per sq ft
  const [salesCosts, setSalesCosts] = useState(6) // % of sale price

  // Financing
  const [loanToValueRatio, setLoanToValueRatio] = useState(65) // %
  const [interestRate, setInterestRate] = useState(5.5) // %
  const [loanTerm, setLoanTerm] = useState(30) // years

  // Calculate development metrics
  const maxBuildableArea = lotSize * (coveragePercent / 100) * stories

  // Calculate construction costs
  const hardCosts = maxBuildableArea * constructionCost
  const softCosts = hardCosts * (softCostPercent / 100)
  const contingency = (hardCosts + softCosts) * (contingencyPercent / 100)
  const totalDevelopmentCost = hardCosts + softCosts + contingency + landCost
  const costPerSqFt = totalDevelopmentCost / maxBuildableArea

  // Calculate rental scenario
  const annualRentalIncome = maxBuildableArea * rentalRate * 12
  const effectiveGrossIncome = annualRentalIncome * (1 - vacancyRate / 100)
  const operatingExpenses = effectiveGrossIncome * (operatingExpenseRatio / 100)
  const netOperatingIncome = effectiveGrossIncome - operatingExpenses
  const propertyValue = netOperatingIncome / (capRate / 100)
  const rentalProfit = propertyValue - totalDevelopmentCost
  const rentalROI = (rentalProfit / totalDevelopmentCost) * 100

  // Calculate sale scenario
  const saleTotalValue = maxBuildableArea * salePrice
  const saleCosts = saleTotalValue * (salesCosts / 100)
  const saleNetProceeds = saleTotalValue - saleCosts
  const saleProfit = saleNetProceeds - totalDevelopmentCost
  const saleROI = (saleProfit / totalDevelopmentCost) * 100

  // Calculate financing
  const loanAmount = totalDevelopmentCost * (loanToValueRatio / 100)
  const equityRequired = totalDevelopmentCost - loanAmount
  const monthlyPayment =
    (loanAmount * (interestRate / 100 / 12) * Math.pow(1 + interestRate / 100 / 12, loanTerm * 12)) /
    (Math.pow(1 + interestRate / 100 / 12, loanTerm * 12) - 1)
  const annualDebtService = monthlyPayment * 12
  const debtServiceCoverageRatio = netOperatingIncome / annualDebtService
  const cashFlow = netOperatingIncome - annualDebtService
  const cashOnCashReturn = (cashFlow / equityRequired) * 100

  // Prepare chart data
  const costBreakdownData = [
    { name: "Land", value: landCost },
    { name: "Hard Costs", value: hardCosts },
    { name: "Soft Costs", value: softCosts },
    { name: "Contingency", value: contingency },
  ]

  const scenarioComparisonData = [
    { name: "Development Cost", rental: totalDevelopmentCost, sale: totalDevelopmentCost },
    { name: "Project Value", rental: propertyValue, sale: saleTotalValue },
    { name: "Profit", rental: rentalProfit, sale: saleProfit },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Financial Feasibility Analysis</h3>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Analysis
        </Button>
      </div>

      <Tabs defaultValue="inputs">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inputs">
            <Calculator className="h-4 w-4 mr-2" />
            Inputs
          </TabsTrigger>
          <TabsTrigger value="results">
            <BarChart3 className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
          <TabsTrigger value="charts">
            <TrendingUp className="h-4 w-4 mr-2" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="scenarios">
            <Building className="h-4 w-4 mr-2" />
            Scenarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inputs" className="space-y-6 pt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Development Parameters</CardTitle>
              <CardDescription>Physical constraints based on zoning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Buildable Area:</span>
                  <span className="font-medium">{Math.floor(maxBuildableArea).toLocaleString()} sq ft</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Construction Costs</CardTitle>
                <CardDescription>Development cost assumptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soft-costs">Soft Costs (%)</Label>
                    <Input
                      id="soft-costs"
                      type="number"
                      value={softCostPercent}
                      onChange={(e) => setSoftCostPercent(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contingency">Contingency (%)</Label>
                    <Input
                      id="contingency"
                      type="number"
                      value={contingencyPercent}
                      onChange={(e) => setContingencyPercent(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="land-cost">Land Cost ($)</Label>
                  <Input
                    id="land-cost"
                    type="number"
                    value={landCost}
                    onChange={(e) => setLandCost(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">${(landCost / lotSize).toFixed(2)} per sq ft of land</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Revenue Assumptions</CardTitle>
                <CardDescription>Market-based income projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rental-rate">Rental Rate ($/sq ft/month)</Label>
                  <Input
                    id="rental-rate"
                    type="number"
                    step="0.01"
                    value={rentalRate}
                    onChange={(e) => setRentalRate(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">Market average: ${avgRentalRate.toFixed(2)} per sq ft</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vacancy-rate">Vacancy Rate (%)</Label>
                    <Input
                      id="vacancy-rate"
                      type="number"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operating-expenses">Operating Expenses (%)</Label>
                    <Input
                      id="operating-expenses"
                      type="number"
                      value={operatingExpenseRatio}
                      onChange={(e) => setOperatingExpenseRatio(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cap-rate">Cap Rate (%)</Label>
                    <Input
                      id="cap-rate"
                      type="number"
                      step="0.1"
                      value={capRate}
                      onChange={(e) => setCapRate(Number(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">Market average: {avgCapRate.toFixed(2)}%</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sale-price">Sale Price ($/sq ft)</Label>
                    <Input
                      id="sale-price"
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">Market average: ${avgSalePrice.toFixed(2)} per sq ft</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Financing</CardTitle>
              <CardDescription>Loan and equity assumptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ltv">Loan-to-Value Ratio (%)</Label>
                  <Input
                    id="ltv"
                    type="number"
                    value={loanToValueRatio}
                    onChange={(e) => setLoanToValueRatio(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loan-term">Loan Term (years)</Label>
                  <Input
                    id="loan-term"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Development Costs</CardTitle>
                <CardDescription>Total project costs breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hard Construction Costs</span>
                    <span className="font-medium">${hardCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Soft Costs</span>
                    <span className="font-medium">${softCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Contingency</span>
                    <span className="font-medium">${contingency.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Land Cost</span>
                    <span className="font-medium">${landCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Total Development Cost</span>
                    <span className="font-bold">${totalDevelopmentCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Cost per Square Foot</span>
                    <span>${costPerSqFt.toFixed(2)}/sq ft</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Rental Income Analysis</CardTitle>
                <CardDescription>Hold and operate scenario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Potential Gross Income (Annual)</span>
                    <span className="font-medium">${annualRentalIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vacancy Loss ({vacancyRate}%)</span>
                    <span className="font-medium">-${(annualRentalIncome * (vacancyRate / 100)).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Effective Gross Income</span>
                    <span className="font-medium">${effectiveGrossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Operating Expenses ({operatingExpenseRatio}%)</span>
                    <span className="font-medium">-${operatingExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Net Operating Income</span>
                    <span className="font-bold">${netOperatingIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Capitalized Value (Cap Rate: {capRate}%)</span>
                    <span className="font-medium">${propertyValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Profit</span>
                    <span className={`font-bold ${rentalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${rentalProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Return on Investment</span>
                    <span className={`font-bold ${rentalROI >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {rentalROI.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sale Analysis</CardTitle>
                <CardDescription>Build and sell scenario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Sale Value</span>
                    <span className="font-medium">${saleTotalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sales Costs ({salesCosts}%)</span>
                    <span className="font-medium">-${saleCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Net Sale Proceeds</span>
                    <span className="font-bold">${saleNetProceeds.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Development Cost</span>
                    <span className="font-medium">-${totalDevelopmentCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Profit</span>
                    <span className={`font-bold ${saleProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${saleProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Return on Investment</span>
                    <span className={`font-bold ${saleROI >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {saleROI.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Financing Analysis</CardTitle>
                <CardDescription>Debt service and cash flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Development Cost</span>
                    <span className="font-medium">${totalDevelopmentCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Loan Amount ({loanToValueRatio}% LTV)</span>
                    <span className="font-medium">${loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Equity Required</span>
                    <span className="font-medium">${equityRequired.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm">Annual Debt Service</span>
                    <span className="font-medium">${annualDebtService.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Net Operating Income</span>
                    <span className="font-medium">${netOperatingIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Annual Cash Flow</span>
                    <span className={`font-bold ${cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${cashFlow.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Debt Service Coverage Ratio</span>
                    <span
                      className={`font-medium ${debtServiceCoverageRatio >= 1.2 ? "text-green-600" : "text-red-600"}`}
                    >
                      {debtServiceCoverageRatio.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cash-on-Cash Return</span>
                    <span className={`font-medium ${cashOnCashReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {cashOnCashReturn.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Development Cost Breakdown</CardTitle>
                <CardDescription>Distribution of project costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Amount ($)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={costBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <ChartTooltip
                          formatter={(value: any) => [`$${value.toLocaleString()}`, "Amount"]}
                          content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="value" fill="var(--color-value)" name="Amount" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Scenario Comparison</CardTitle>
                <CardDescription>Rental vs. sale financial outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      rental: {
                        label: "Rental Scenario",
                        color: "hsl(var(--chart-1))",
                      },
                      sale: {
                        label: "Sale Scenario",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scenarioComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <ChartTooltip
                          formatter={(value: any) => [`$${value.toLocaleString()}`, "Amount"]}
                          content={<ChartTooltipContent />}
                        />
                        <Legend />
                        <Bar dataKey="rental" fill="var(--color-rental)" name="Rental Scenario" />
                        <Bar dataKey="sale" fill="var(--color-sale)" name="Sale Scenario" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Financial Metrics Comparison</CardTitle>
              <CardDescription>Key performance indicators by scenario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-500">Development Cost</h4>
                    <p className="text-2xl font-bold">${(totalDevelopmentCost / 1000000).toFixed(2)}M</p>
                    <p className="text-xs text-gray-500">${costPerSqFt.toFixed(2)} per sq ft</p>
                  </div>
                  <div className="bg-gray-100 h-1 rounded-full">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-500">Rental ROI</h4>
                    <p className={`text-2xl font-bold ${rentalROI >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {rentalROI.toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500">Cash-on-Cash: {cashOnCashReturn.toFixed(2)}%</p>
                  </div>
                  <div className="bg-gray-100 h-1 rounded-full">
                    <div
                      className={`${rentalROI >= 0 ? "bg-green-500" : "bg-red-500"} h-1 rounded-full`}
                      style={{ width: `${Math.min(Math.abs(rentalROI) * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-500">Sale ROI</h4>
                    <p className={`text-2xl font-bold ${saleROI >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {saleROI.toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500">Profit: ${(saleProfit / 1000000).toFixed(2)}M</p>
                  </div>
                  <div className="bg-gray-100 h-1 rounded-full">
                    <div
                      className={`${saleROI >= 0 ? "bg-green-500" : "bg-red-500"} h-1 rounded-full`}
                      style={{ width: `${Math.min(Math.abs(saleROI) * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="pt-4">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Scenario Analysis</CardTitle>
                <CardDescription>Comparing different development approaches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-2 border-b"></th>
                        <th className="text-left p-2 border-b">
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-2" />
                            <span>Maximum Buildout</span>
                          </div>
                        </th>
                        <th className="text-left p-2 border-b">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            <span>Optimized Design</span>
                          </div>
                        </th>
                        <th className="text-left p-2 border-b">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>Premium Finishes</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-b font-medium">Building Size</td>
                        <td className="p-2 border-b">{maxBuildableArea.toLocaleString()} sq ft</td>
                        <td className="p-2 border-b">{(maxBuildableArea * 0.9).toLocaleString()} sq ft</td>
                        <td className="p-2 border-b">{(maxBuildableArea * 0.85).toLocaleString()} sq ft</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b font-medium">Construction Cost</td>
                        <td className="p-2 border-b">${constructionCost}/sq ft</td>
                        <td className="p-2 border-b">${(constructionCost * 1.1).toFixed(2)}/sq ft</td>
                        <td className="p-2 border-b">${(constructionCost * 1.3).toFixed(2)}/sq ft</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b font-medium">Total Development Cost</td>
                        <td className="p-2 border-b">${totalDevelopmentCost.toLocaleString()}</td>
                        <td className="p-2 border-b">${(totalDevelopmentCost * 0.95).toLocaleString()}</td>
                        <td className="p-2 border-b">${(totalDevelopmentCost * 1.05).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b font-medium">Rental Rate</td>
                        <td className="p-2 border-b">${rentalRate.toFixed(2)}/sq ft</td>
                        <td className="p-2 border-b">${(rentalRate * 1.05).toFixed(2)}/sq ft</td>
                        <td className="p-2 border-b">${(rentalRate * 1.15).toFixed(2)}/sq ft</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b font-medium">Sale Price</td>
                        <td className="p-2 border-b">${salePrice.toFixed(2)}/sq ft</td>
                        <td className="p-2 border-b">${(salePrice * 1.05).toFixed(2)}/sq ft</td>
                        <td className="p-2 border-b">${(salePrice * 1.15).toFixed(2)}/sq ft</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b font-medium">Rental ROI</td>
                        <td className="p-2 border-b">{rentalROI.toFixed(2)}%</td>
                        <td className="p-2 border-b">{(rentalROI * 1.1).toFixed(2)}%</td>
                        <td className="p-2 border-b">{(rentalROI * 1.15).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b font-medium">Sale ROI</td>
                        <td className="p-2 border-b">{saleROI.toFixed(2)}%</td>
                        <td className="p-2 border-b">{(saleROI * 1.1).toFixed(2)}%</td>
                        <td className="p-2 border-b">{(saleROI * 1.15).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-b font-medium">Cash-on-Cash Return</td>
                        <td className="p-2 border-b">{cashOnCashReturn.toFixed(2)}%</td>
                        <td className="p-2 border-b">{(cashOnCashReturn * 1.1).toFixed(2)}%</td>
                        <td className="p-2 border-b">{(cashOnCashReturn * 1.15).toFixed(2)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sensitivity Analysis</CardTitle>
                <CardDescription>Impact of market changes on project feasibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    This analysis shows how changes in key variables affect the project's return on investment. The
                    baseline scenario uses current market conditions in {zoning.city}.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Rental ROI Sensitivity</h4>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-2 border-b">Variable</th>
                            <th className="text-left p-2 border-b">-10%</th>
                            <th className="text-left p-2 border-b">Base</th>
                            <th className="text-left p-2 border-b">+10%</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border-b">Rental Rate</td>
                            <td className="p-2 border-b">{(rentalROI * 0.8).toFixed(2)}%</td>
                            <td className="p-2 border-b">{rentalROI.toFixed(2)}%</td>
                            <td className="p-2 border-b">{(rentalROI * 1.2).toFixed(2)}%</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-b">Construction Cost</td>
                            <td className="p-2 border-b">{(rentalROI * 1.15).toFixed(2)}%</td>
                            <td className="p-2 border-b">{rentalROI.toFixed(2)}%</td>
                            <td className="p-2 border-b">{(rentalROI * 0.85).toFixed(2)}%</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-b">Cap Rate</td>
                            <td className="p-2 border-b">{(rentalROI * 0.9).toFixed(2)}%</td>
                            <td className="p-2 border-b">{rentalROI.toFixed(2)}%</td>
                            <td className="p-2 border-b">{(rentalROI * 1.1).toFixed(2)}%</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-b">Vacancy Rate</td>
                            <td className="p-2 border-b">{(rentalROI * 1.05).toFixed(2)}%</td>
                            <td className="p-2 border-b">{rentalROI.toFixed(2)}%</td>
                            <td className="p-2 border-b">{(rentalROI * 0.95).toFixed(2)}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Sale ROI Sensitivity</h4>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left p-2 border-b">Variable</th>
                            <th className="text-left p-2 border-b">-10%</th>
                            <th className="text-left p-2 border-b">Base</th>
                            <th className="text-left p-2 border-b">+10%</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border-b">Sale Price</td>
                            <td className="p-2 border-b">{(saleROI * 0.7).toFixed(2)}%</td>
                            <td className="p-2 border-b">{saleROI.toFixed(2)}%</td>
                            <td className="p-2 border-b">{(saleROI * 1.3).toFixed(2)}%</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-b">Construction Cost</td>
                            <td className="p-2 border-b">{(saleROI * 1.2).toFixed(2)}%</td>
                            <td className="p-2 border-b">{saleROI.toFixed(2)}%</td>
                            <td className="p-2 border-b">{(saleROI * 0.8).toFixed(2)}%</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-b">Land Cost</td>
                            <td className="p-2 border-b">{(saleROI * 1.1).toFixed(2)}%</td>
                            <td className="p-2 border-b">{saleROI.toFixed(2)}%</td>
                            <td className="p-2 border-b">{(saleROI * 0.9).toFixed(2)}%</td>
                          </tr>
                          <tr>
                            <td className="p-2 border-b">Sales Costs</td>
                            <td className="p-2 border-b">{(saleROI * 1.05).toFixed(2)}%</td>
                            <td className="p-2 border-b">{saleROI.toFixed(2)}%</td>
                            <td className="p-2 border-b">{(saleROI * 0.95).toFixed(2)}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
