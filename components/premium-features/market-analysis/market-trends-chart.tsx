"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { marketTrendsData } from "@/lib/market-data"

interface MarketTrendsChartProps {
  timeFrame: number
  propertyType: string
}

export default function MarketTrendsChart({ timeFrame, propertyType }: MarketTrendsChartProps) {
  const [dataType, setDataType] = useState<"price" | "rent">("price")

  // Filter data based on timeFrame and propertyType
  const filteredData = marketTrendsData.filter((item) => item.propertyType === propertyType).slice(-timeFrame)

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button variant={dataType === "price" ? "default" : "outline"} size="sm" onClick={() => setDataType("price")}>
          Sale Prices
        </Button>
        <Button variant={dataType === "rent" ? "default" : "outline"} size="sm" onClick={() => setDataType("rent")}>
          Rental Rates
        </Button>
      </div>

      <div className="h-[300px]">
        <ChartContainer
          config={{
            [dataType === "price" ? "salePrice" : "rentalPrice"]: {
              label: dataType === "price" ? "Sale Price per Sq Ft" : "Rental Price per Sq Ft",
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={["auto", "auto"]} tickFormatter={(value) => `$${value}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataType === "price" ? "salePrice" : "rentalPrice"}
                stroke="var(--color-salePrice)"
                name={dataType === "price" ? "Sale Price per Sq Ft" : "Rental Price per Sq Ft"}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="text-sm text-gray-500">
        {dataType === "price"
          ? `Sale prices for ${propertyType.replace("-", " ")} properties over the past ${timeFrame} months`
          : `Rental rates for ${propertyType.replace("-", " ")} properties over the past ${timeFrame} months`}
      </div>
    </div>
  )
}
