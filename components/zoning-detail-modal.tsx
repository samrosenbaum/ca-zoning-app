"use client"

import { MapPin, Home, Ruler, Maximize2, Building, Trees } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ZoningInfo } from "@/lib/types"

interface ZoningDetailModalProps {
  zoning: ZoningInfo
  isOpen: boolean
  onClose: () => void
}

export default function ZoningDetailModal({ zoning, isOpen, onClose }: ZoningDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{zoning.city} Zoning Details</DialogTitle>
            <Badge variant={zoning.zoningType === "R1" ? "default" : "secondary"}>{zoning.zoningType}</Badge>
          </div>
          <DialogDescription className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {zoning.county} County, California
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Lot Requirements</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Maximize2 className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Minimum Lot Size: {zoning.minLotSize.toLocaleString()} sq ft</span>
                </div>
                <div className="flex items-center">
                  <Ruler className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Minimum Lot Width: {zoning.minLotWidth} ft</span>
                </div>
                <div className="flex items-center">
                  <Ruler className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Minimum Lot Depth: {zoning.minLotDepth} ft</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Setbacks</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm">Front: {zoning.setbacks.front} ft</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">Rear: {zoning.setbacks.rear} ft</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">Side: {zoning.setbacks.side} ft</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Building Requirements</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Maximum Height: {zoning.maxHeight} ft</span>
                </div>
                <div className="flex items-center">
                  <Maximize2 className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Maximum Coverage: {zoning.maxCoverage}%</span>
                </div>
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Maximum Stories: {zoning.maxStories}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Additional Information</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Allowed Uses: {zoning.allowedUses.join(", ")}</span>
                </div>
                <div className="flex items-center">
                  <Trees className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">Open Space Requirement: {zoning.openSpaceReq}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-lg">
          <p className="text-sm text-gray-500">
            <strong>Note:</strong> {zoning.notes}
          </p>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
