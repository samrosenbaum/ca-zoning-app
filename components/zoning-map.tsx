"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import type { ZoningInfo } from "@/lib/types"

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

interface ZoningMapProps {
  zoningData: ZoningInfo[]
  onMarkerClick: (zoning: ZoningInfo) => void
}

export default function ZoningMap({ zoningData, onMarkerClick }: ZoningMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Center of California (approximate)
  const centerPosition: [number, number] = [37.1, -119.4]
  const defaultZoom = 6

  if (!isMounted) {
    return (
      <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={centerPosition}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {zoningData.map((zoning) => (
          <Marker
            key={`${zoning.city}-${zoning.zoningType}`}
            position={[zoning.coordinates.lat, zoning.coordinates.lng]}
            eventHandlers={{
              click: () => {
                onMarkerClick(zoning)
              },
            }}
          >
            <Popup>
              <Card className="border-0 shadow-none">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{zoning.city}</h3>
                    <Badge variant={zoning.zoningType === "R1" ? "default" : "secondary"} className="ml-2">
                      {zoning.zoningType}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{zoning.county} County</p>
                  <div className="text-xs">
                    <div>Min. Lot: {zoning.minLotSize.toLocaleString()} sq ft</div>
                    <div>Max Height: {zoning.maxHeight} ft</div>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto mt-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMarkerClick(zoning)
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
