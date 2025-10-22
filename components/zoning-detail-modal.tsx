"use client"

import { MapPin, Home, Ruler, Maximize2, Building, Trees } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ZoningInfo } from "@/lib/types"

interface ZoningDetailModalProps {
  zoning: ZoningInfo
  isOpen: boolean
  onClose: () => void
}

export default function ZoningDetailModal({ zoning, isOpen, onClose }: ZoningDetailModalProps) {
  const isR1Type = zoning.zoningType === "R1" || zoning.zoningType === "RS" || zoning.zoningType === "RH-1"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden bg-white border-gray-200 shadow-2xl">
        {/* Header with gradient */}
        <DialogHeader className="px-8 pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200/60">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 mb-2">{zoning.city}</DialogTitle>
              <DialogDescription className="flex items-center text-base font-medium text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {zoning.county} County, California
              </DialogDescription>
            </div>
            <Badge
              variant={isR1Type ? "default" : "secondary"}
              className={`${
                isR1Type ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-green-500 to-green-600"
              } text-white border-0 font-semibold px-4 py-2 text-base shadow-sm`}
            >
              {zoning.zoningType}
            </Badge>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/60">
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Lot Requirements</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center text-sm font-medium text-gray-600">
                      <Maximize2 className="w-4 h-4 mr-2.5 text-gray-400" />
                      Minimum Lot Size
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {zoning.minLotSize.toLocaleString()} sq ft
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center text-sm font-medium text-gray-600">
                      <Ruler className="w-4 h-4 mr-2.5 text-gray-400" />
                      Minimum Lot Width
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">{zoning.minLotWidth} ft</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center text-sm font-medium text-gray-600">
                      <Ruler className="w-4 h-4 mr-2.5 text-gray-400" />
                      Minimum Lot Depth
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">{zoning.minLotDepth} ft</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/60">
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Setbacks</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Front Setback</span>
                    <span className="font-semibold text-gray-900 tabular-nums">{zoning.setbacks.front} ft</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Rear Setback</span>
                    <span className="font-semibold text-gray-900 tabular-nums">{zoning.setbacks.rear} ft</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-600">Side Setback</span>
                    <span className="font-semibold text-gray-900 tabular-nums">{zoning.setbacks.side} ft</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/60">
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Building Requirements</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center text-sm font-medium text-gray-600">
                      <Building className="w-4 h-4 mr-2.5 text-gray-400" />
                      Maximum Height
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">{zoning.maxHeight} ft</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div className="flex items-center text-sm font-medium text-gray-600">
                      <Maximize2 className="w-4 h-4 mr-2.5 text-gray-400" />
                      Maximum Coverage
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">{zoning.maxCoverage}%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center text-sm font-medium text-gray-600">
                      <Home className="w-4 h-4 mr-2.5 text-gray-400" />
                      Maximum Stories
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">{zoning.maxStories}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/60">
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Additional Information</h4>
                <div className="space-y-3">
                  <div className="py-2 border-b border-gray-200">
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                      <Home className="w-4 h-4 mr-2.5 text-gray-400" />
                      Allowed Uses
                    </div>
                    <span className="text-sm font-medium text-gray-900">{zoning.allowedUses.join(", ")}</span>
                  </div>
                  <div className="py-2">
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-2">
                      <Trees className="w-4 h-4 mr-2.5 text-gray-400" />
                      Open Space Requirement
                    </div>
                    <span className="font-semibold text-gray-900 tabular-nums">{zoning.openSpaceReq}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 p-5 bg-blue-50 border border-blue-200/60 rounded-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3"></div>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Important Note</p>
                <p className="text-sm text-blue-800 leading-relaxed">{zoning.notes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200/60 flex justify-end">
          <Button onClick={onClose} className="bg-gray-900 hover:bg-gray-800 text-white font-semibold shadow-sm px-6">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
