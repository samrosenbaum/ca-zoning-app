"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download, Info, Clock, CalendarDays, AlertTriangle, ChevronDown } from "lucide-react"
import { approvalHistoricalData, timelineStages, timelineFactors } from "@/lib/approval-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ApprovalTimelineChart from "./approval-timeline-chart"
import ApprovalTimeline from "./approval-timeline"
import ApprovalComparisonTable from "./approval-comparison-table"

const calculateEstimatedTimeline = (
  city: string,
  projectType: string,
  projectSize: string,
  approvalType: string,
): { min: number; max: number; avg: number; confidence: "low" | "medium" | "high" } => {
  // Filter historical data
  const filteredData = approvalHistoricalData.filter(
    (item) =>
      (city === "all" || item.city === city) &&
      (projectType === "all" || item.projectType === projectType) &&
      (projectSize === "all" || item.projectSize === projectSize) &&
      (approvalType === "all" || item.approvalType === approvalType),
  )

  if (filteredData.length === 0) {
    return { min: 0, max: 0, avg: 0, confidence: "low" }
  }

  // Calculate statistics
  const durations = filteredData.map((item) => item.durationDays)
  const avg = Math.round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length)
  const min = Math.min(...durations)
  const max = Math.max(...durations)

  // Determine confidence based on sample size and variance
  let confidence: "low" | "medium" | "high" = "low"
  if (filteredData.length >= 5) {
    const variance = durations.reduce((sum, duration) => sum + Math.pow(duration - avg, 2), 0) / durations.length
    const standardDeviation = Math.sqrt(variance)
    const coefficientOfVariation = standardDeviation / avg

    if (coefficientOfVariation < 0.2) {
      confidence = "high"
    } else if (coefficientOfVariation < 0.4) {
      confidence = "medium"
    }
  } else if (filteredData.length >= 3) {
    confidence = "medium"
  }

  return { min, max, avg, confidence }
}

interface ApprovalTimelineForecasterProps {
  isPremium: boolean
}

export default function ApprovalTimelineForecaster({ isPremium }: ApprovalTimelineForecasterProps) {
  const [city, setCity] = useState("all")
  const [projectType, setProjectType] = useState("all")
  const [projectSize, setProjectSize] = useState("all")
  const [approvalType, setApprovalType] = useState("building-permit")
  const [complexityAdjustment, setComplexityAdjustment] = useState(0)

  const uniqueCities = useMemo(() => {
    const cities = approvalHistoricalData.map((item) => item.city)
    return ["all", ...Array.from(new Set(cities))].sort()
  }, [])

  const { min, max, avg, confidence } = calculateEstimatedTimeline(city, projectType, projectSize, approvalType)

  // Adjust timeline based on complexity
  const adjustedAvg = Math.round(avg * (1 + complexityAdjustment / 10))
  const adjustedMin = Math.round(min * (1 + complexityAdjustment / 20))
  const adjustedMax = Math.round(max * (1 + complexityAdjustment / 5))

  // Filter relevant historical data
  const relevantData = useMemo(() => {
    return approvalHistoricalData.filter(
      (item) =>
        (city === "all" || item.city === city) &&
        (projectType === "all" || item.projectType === projectType) &&
        (projectSize === "all" || item.projectSize === projectSize) &&
        (approvalType === "all" || item.approvalType === approvalType),
    )
  }, [city, projectType, projectSize, approvalType])

  // Get stages for the selected approval type
  const stages = timelineStages[approvalType] || []

  if (!isPremium) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Approval Timeline Forecasting
          </CardTitle>
          <CardDescription>
            Forecast permitting and approval timelines based on historical data across California.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-3">
            <CalendarDays className="h-16 w-16 mx-auto text-gray-300" />
            <h3 className="text-lg font-medium">Premium Feature</h3>
            <p className="text-sm text-gray-500 max-w-md">
              Unlock our approval timeline forecasting tool to predict permitting durations for different project types
              across California municipalities.
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Approval Timeline Forecasting
            </CardTitle>
            <CardDescription>
              Forecast permitting and approval timelines based on historical data across California.
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="mt-4 md:mt-0">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export to PDF</DropdownMenuItem>
              <DropdownMenuItem>Export to Excel</DropdownMenuItem>
              <DropdownMenuItem>Add to Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger id="city">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map(
                  (city) =>
                    city !== "all" && (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="project-type">Project Type</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger id="project-type">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Project Types</SelectItem>
                <SelectItem value="single-family">Single Family</SelectItem>
                <SelectItem value="multi-family">Multi-Family</SelectItem>
                <SelectItem value="mixed-use">Mixed Use</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="adu">ADU</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="project-size">Project Size</Label>
            <Select value={projectSize} onValueChange={setProjectSize}>
              <SelectTrigger id="project-size">
                <SelectValue placeholder="Select project size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="approval-type">Approval Type</Label>
            <Select value={approvalType} onValueChange={setApprovalType}>
              <SelectTrigger id="approval-type">
                <SelectValue placeholder="Select approval type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building-permit">Building Permit</SelectItem>
                <SelectItem value="conditional-use">Conditional Use Permit</SelectItem>
                <SelectItem value="zoning-variance">Zoning Variance</SelectItem>
                <SelectItem value="design-review">Design Review</SelectItem>
                <SelectItem value="environmental-review">Environmental Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="complexity" className="flex items-center">
              Project Complexity
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="w-80">
                    <p>
                      Adjust this slider to account for specific factors that might make your project more complex than
                      average, such as site constraints, design complexity, or political sensitivity.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="text-sm">
              {complexityAdjustment === 0 ? "Average" : complexityAdjustment < 0 ? "Less Complex" : "More Complex"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setComplexityAdjustment(-5)}
              className="px-2"
              disabled={complexityAdjustment <= -5}
            >
              --
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setComplexityAdjustment(Math.max(-5, complexityAdjustment - 1))}
              className="px-2"
              disabled={complexityAdjustment <= -5}
            >
              -
            </Button>
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  complexityAdjustment < 0
                    ? "bg-green-500"
                    : complexityAdjustment === 0
                      ? "bg-blue-500"
                      : "bg-orange-500"
                }`}
                style={{
                  width: `${((complexityAdjustment + 5) / 10) * 100}%`,
                  marginLeft: `${complexityAdjustment === -5 ? "0" : "50%"}`,
                  transform: `${complexityAdjustment === -5 ? "none" : "translateX(-50%)"}`,
                }}
              ></div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setComplexityAdjustment(Math.min(5, complexityAdjustment + 1))}
              className="px-2"
              disabled={complexityAdjustment >= 5}
            >
              +
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setComplexityAdjustment(5)}
              className="px-2"
              disabled={complexityAdjustment >= 5}
            >
              ++
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Average Timeline</p>
                <div className="flex items-center justify-center">
                  <p className="text-3xl font-bold">{adjustedAvg}</p>
                  <p className="text-lg ml-1">days</p>
                </div>
                <Badge
                  className={`mt-1 ${
                    confidence === "high" ? "bg-green-500" : confidence === "medium" ? "bg-yellow-500" : "bg-red-500"
                  }`}
                >
                  {confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Timeline Range</p>
                <div className="flex items-center justify-center">
                  <p className="text-3xl font-bold">
                    {adjustedMin} - {adjustedMax}
                  </p>
                  <p className="text-lg ml-1">days</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Based on historical data variability</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Sample Size</p>
                <p className="text-3xl font-bold">{relevantData.length}</p>
                <p className="text-xs text-gray-500 mt-1">Historical data points analyzed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="timeline">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timeline">Visual Timeline</TabsTrigger>
            <TabsTrigger value="comparison">City Comparison</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="factors">Risk Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="pt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Estimated Approval Timeline</h3>
              <ApprovalTimeline stages={stages} adjustmentFactor={1 + complexityAdjustment / 10} />

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Timeline Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Pre-Application Meetings</h4>
                        <p className="text-sm text-gray-600">
                          Schedule pre-application meetings with planning staff to identify potential issues early in
                          the process.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Complete Applications</h4>
                        <p className="text-sm text-gray-600">
                          Ensure your application is complete with all required documents to avoid processing delays.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Community Engagement</h4>
                        <p className="text-sm text-gray-600">
                          Engage with community stakeholders early to address concerns before formal public hearings.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="pt-6">
            <ApprovalComparisonTable
              data={approvalHistoricalData}
              projectType={projectType === "all" ? undefined : (projectType as any)}
              projectSize={projectSize === "all" ? undefined : (projectSize as any)}
              approvalType={approvalType}
            />
          </TabsContent>

          <TabsContent value="statistics" className="pt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Historical Approval Statistics</h3>
              <div className="h-80">
                <ApprovalTimelineChart data={relevantData} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Project Type Comparison</CardTitle>
                    <CardDescription>Average approval days by project type</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {["single-family", "multi-family", "mixed-use", "commercial", "adu"].map((type) => {
                      const typeData = approvalHistoricalData.filter(
                        (item) =>
                          item.projectType === type &&
                          (city === "all" || item.city === city) &&
                          (approvalType === "all" || item.approvalType === approvalType),
                      )
                      const avgDuration =
                        typeData.length > 0
                          ? Math.round(typeData.reduce((sum, item) => sum + item.durationDays, 0) / typeData.length)
                          : 0

                      return (
                        <div key={type} className="flex items-center">
                          <div className="w-40 text-sm">
                            {type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div
                                className={`h-2 bg-blue-500 rounded-full`}
                                style={{ width: `${Math.min((avgDuration / 240) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-16 text-right font-medium">
                            {avgDuration > 0 ? `${avgDuration} days` : "N/A"}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Approval Outcomes</CardTitle>
                    <CardDescription>Success rate of approval applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {["approved", "denied", "withdrawn"].map((outcome) => {
                        const count = relevantData.filter((item) => item.outcome === outcome).length
                        const percentage = relevantData.length > 0 ? (count / relevantData.length) * 100 : 0

                        return (
                          <div key={outcome} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm capitalize">{outcome}</span>
                              <span className="text-sm font-medium">{Math.round(percentage)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div
                                className={`h-2 rounded-full ${
                                  outcome === "approved"
                                    ? "bg-green-500"
                                    : outcome === "denied"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}

                      <div className="pt-4 text-center">
                        <p className="text-sm text-gray-600">
                          {relevantData.length > 0
                            ? `Based on ${relevantData.length} historical applications`
                            : "No relevant data available"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="factors" className="pt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Risk Factors Affecting Approval Timelines</h3>

              <div className="grid grid-cols-1 gap-4">
                {timelineFactors.map((factor, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-full mr-4 ${
                            factor.impact === "high"
                              ? "bg-red-100 text-red-600"
                              : factor.impact === "medium"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                          }`}
                        >
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{factor.factor}</h4>
                            <Badge
                              className={`ml-2 ${
                                factor.impact === "high"
                                  ? "bg-red-500"
                                  : factor.impact === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                            >
                              {factor.impact.toUpperCase()} IMPACT
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Mitigation Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Early Stakeholder Engagement</h4>
                        <p className="text-sm text-gray-600">
                          Engage with community groups, local officials, and planning staff early in the process to
                          identify and address concerns.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Thorough Due Diligence</h4>
                        <p className="text-sm text-gray-600">
                          Conduct comprehensive site analysis and regulatory research before submitting applications to
                          anticipate issues.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-amber-100 text-amber-600 p-2 rounded-full">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Professional Expertise</h4>
                        <p className="text-sm text-gray-600">
                          Engage experienced planning consultants, architects, and land use attorneys familiar with
                          local processes and politics.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
