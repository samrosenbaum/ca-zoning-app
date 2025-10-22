"use client"

import { MapPin, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ZoningInfo } from "@/lib/types"

interface ZoningCardProps {
  zoning: ZoningInfo
  onClick: () => void
}

export default function ZoningCard({ zoning, onClick }: ZoningCardProps) {
  const isR1Type = zoning.zoningType === "R1" || zoning.zoningType === "RS" || zoning.zoningType === "RH-1"

  return (
    <Card className="group overflow-hidden border-gray-200/60 bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-gray-300/80">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-1">{zoning.city}</h3>
            <div className="flex items-center text-gray-500 text-sm font-medium">
              <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
              {zoning.county} County
            </div>
          </div>
          <Badge
            variant={isR1Type ? "default" : "secondary"}
            className={`${
              isR1Type
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm"
            } text-white border-0 font-semibold px-3 py-1`}
          >
            {zoning.zoningType}
          </Badge>
        </div>

        <div className="space-y-3.5 mt-5">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-600">Minimum Lot Size</div>
            <div className="font-semibold text-gray-900 tabular-nums">
              {zoning.minLotSize.toLocaleString()} <span className="text-xs font-normal text-gray-500">sq ft</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-600">Maximum Height</div>
            <div className="font-semibold text-gray-900 tabular-nums">
              {zoning.maxHeight} <span className="text-xs font-normal text-gray-500">ft</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="text-sm font-medium text-gray-600">Max Coverage</div>
            <div className="font-semibold text-gray-900 tabular-nums">
              {zoning.maxCoverage}
              <span className="text-xs font-normal text-gray-500">%</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-b from-gray-50/50 to-gray-50 px-6 py-4 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full group-hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-gray-900"
          onClick={onClick}
        >
          <span>View Details</span>
          <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
