"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import type { ZoningInfo } from "@/lib/types"

// First, import the icon-related components from react-leaflet and leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

// Add these new imports for the icon and legend components
const Icon = dynamic(() => import("leaflet").then((mod) => mod.Icon), { ssr: false })
const DivIcon = dynamic(() => import("leaflet").then((mod) => mod.DivIcon), { ssr: false })
const Control = dynamic(() => import("react-leaflet").then((mod) => mod.LayersControl), { ssr: false })

interface ZoningMapProps {
  zoningData: ZoningInfo[]
  onMarkerClick: (zoning: ZoningInfo) => void
}

// Replace the ZoningMap component with this updated version that includes custom markers and a legend
export default function ZoningMap({ zoningData, onMarkerClick }: ZoningMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [icons, setIcons] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    setIsMounted(true)

    // Create custom icons when component mounts
    if (typeof window !== "undefined") {
      const leaflet = require("leaflet")

      setIcons({
        R1: new leaflet.Icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
        RL: new leaflet.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
        RH1: new leaflet.Icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
        RS: new leaflet.Icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
    }
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
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-md relative">
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

        {/* Map Legend */}
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control leaflet-bar bg-white p-3 m-2 rounded shadow-md">
            <h4 className="font-medium text-sm mb-2">Zoning Types</h4>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs">R1 - Residential One</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs">RL - Residential Low</span>
            </div>
          </div>
        </div>

        {zoningData.map((zoning) => {
          // Determine which icon to use based on zoning type
          const iconKey =
            zoning.zoningType.startsWith("R1") || zoning.zoningType === "RS" || zoning.zoningType === "RH-1"
              ? "R1"
              : "RL"
          const icon = icons[iconKey]

          return (
            <Marker
              key={`${zoning.city}-${zoning.zoningType}`}
              position={[zoning.coordinates.lat, zoning.coordinates.lng]}
              icon={icon}
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
                      <Badge
                        variant={
                          zoning.zoningType === "R1" || zoning.zoningType === "RS" || zoning.zoningType === "RH-1"
                            ? "default"
                            : "secondary"
                        }
                        className="ml-2"
                      >
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
          )
        })}
      </MapContainer>

      {/* Mobile Legend (outside the map container for better mobile display) */}
      <div className="md:hidden absolute bottom-4 left-4 right-4 bg-white p-3 rounded-md shadow-md z-10 flex justify-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs">R1</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs">RL</span>
          </div>
        </div>
      </div>
    </div>
  )
}
