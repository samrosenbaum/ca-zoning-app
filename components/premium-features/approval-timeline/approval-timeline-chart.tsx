"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { ApprovalTimelineDataPoint } from "@/lib/types"

interface ApprovalTimelineChartProps {
  data: ApprovalTimelineDataPoint[]
}

export default function ApprovalTimelineChart({ data }: ApprovalTimelineChartProps) {
  // Prepare data for chart
  const chartData = useMemo(() => {
    // Group by project type
    const groupedByType: Record<string, ApprovalTimelineDataPoint[]> = {}
    data.forEach((item) => {
      if (!groupedByType[item.projectType]) {
        groupedByType[item.projectType] = []
      }
      groupedByType[item.projectType].push(item)
    })

    // Calculate average duration for each project type
    const formattedData = Object.entries(groupedByType).map(([type, items]) => {
      const avgDuration = items.reduce((sum, item) => sum + item.durationDays, 0) / items.length
      return {
        name: type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: Math.round(avgDuration),
      }
    })

    return formattedData
  }, [data])

  // If no data, show a message
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available for the selected criteria.</p>
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        value: {
          label: "Avg. Approval Days",
          color: "hsl(var(--chart-1))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="value" fill="var(--color-value)" name="Avg. Approval Days" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
