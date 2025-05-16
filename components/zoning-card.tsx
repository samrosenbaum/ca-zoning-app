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
  // Determine if this is an R1-type zoning (includes variants like RS, RH-1)
  const isR1Type = zoning.zoningType === "R1" || zoning.zoningType === "RS" || zoning.zoningType === "RH-1"

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{zoning.city}</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {zoning.county} County
            </div>
          </div>
          <Badge
            variant={isR1Type ? "default" : "secondary"}
            className={isR1Type ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}
          >
            {zoning.zoningType}
          </Badge>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Minimum Lot Size</div>
            <div className="font-medium">{zoning.minLotSize.toLocaleString()} sq ft</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Maximum Height</div>
            <div className="font-medium">{zoning.maxHeight} ft</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Max Coverage</div>
            <div className="font-medium">{zoning.maxCoverage}%</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3">
        <Button variant="ghost" className="w-full" onClick={onClick}>
          <span>View Details</span>
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}
