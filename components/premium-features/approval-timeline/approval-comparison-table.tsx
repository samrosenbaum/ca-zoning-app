"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ApprovalTimelineDataPoint } from "@/lib/types"

interface ApprovalComparisonTableProps {
  data: ApprovalTimelineDataPoint[]
  projectType?: "single-family" | "multi-family" | "mixed-use" | "commercial" | "adu"
  projectSize?: "small" | "medium" | "large"
  approvalType: string
}

export default function ApprovalComparisonTable({
  data,
  projectType,
  projectSize,
  approvalType,
}: ApprovalComparisonTableProps) {
  // Group and calculate average duration by city
  const cityData = useMemo(() => {
    const filteredData = data.filter(
      (item) =>
        (projectType ? item.projectType === projectType : true) &&
        (projectSize ? item.projectSize === projectSize : true) &&
        item.approvalType === approvalType,
    )

    const cityGroups: Record<string, ApprovalTimelineDataPoint[]> = {}
    filteredData.forEach((item) => {
      if (!cityGroups[item.city]) {
        cityGroups[item.city] = []
      }
      cityGroups[item.city].push(item)
    })

    return Object.entries(cityGroups)
      .map(([city, items]) => {
        const avgDuration = Math.round(items.reduce((sum, item) => sum + item.durationDays, 0) / items.length)
        const successRate = (items.filter((item) => item.outcome === "approved").length / items.length) * 100

        return {
          city,
          avgDuration,
          sampleSize: items.length,
          successRate,
          minDuration: Math.min(...items.map((item) => item.durationDays)),
          maxDuration: Math.max(...items.map((item) => item.durationDays)),
        }
      })
      .sort((a, b) => a.avgDuration - b.avgDuration)
  }, [data, projectType, projectSize, approvalType])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        City Comparison for {approvalType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </h3>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">City</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium">
                  Avg. Duration
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Timeline Range
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">Minimum to maximum approval days from historical data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-auto font-medium">
                  Success Rate
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" className="p-0 h-auto font-medium">
                  Sample Size
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cityData.map((city) => (
              <TableRow key={city.city}>
                <TableCell className="font-medium">{city.city}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">{city.avgDuration} days</span>
                    <div className="h-2 w-24 bg-gray-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.min((city.avgDuration / 240) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {city.minDuration} - {city.maxDuration} days
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">{Math.round(city.successRate)}%</span>
                    <Badge
                      className={`${
                        city.successRate >= 80
                          ? "bg-green-500"
                          : city.successRate >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {city.successRate >= 80 ? "HIGH" : city.successRate >= 50 ? "MEDIUM" : "LOW"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">{city.sampleSize}</TableCell>
              </TableRow>
            ))}

            {cityData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No comparison data available for the selected criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500 italic">
        {projectType || projectSize ? (
          <span>
            Filtered by: {projectType && projectType.replace("-", " ")} {projectSize && projectSize} projects
          </span>
        ) : (
          <span>Showing all project types and sizes</span>
        )}
      </div>
    </div>
  )
}
