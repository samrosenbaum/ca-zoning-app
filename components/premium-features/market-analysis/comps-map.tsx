"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import dynamic from "next/dynamic"
import type { RentalComp, SalesComp } from "@/lib/types"

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false })
const Icon = dynamic(() => import("leaflet").then((mod) => mod.Icon), { ssr: false })

interface CompsMapProps {
  rentalComps: RentalComp[]
  salesComps: SalesComp[]
  centerLat: number
  centerLng: number
}

export default function CompsMap({ rentalComps, salesComps, centerLat, centerLng }: CompsMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [icons, setIcons] = useState<{ [key: string]: any }>({})
  const [showRentals, setShowRentals] = useState(true)
  const [showSales, setShowSales] = useState(true)

  useEffect(() => {
    setIsMounted(true)

    // Create custom icons when component mounts
    if (typeof window !== "undefined") {
      const leaflet = require("leaflet")

      setIcons({
        target: new leaflet.Icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
        rental: new leaflet.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
        sale: new leaflet.Icon({
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

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  // Find the maximum distance to set the circle radius
  const maxDistance = Math.max(
    ...rentalComps.map((comp) => comp.distanceFromTarget),
    ...salesComps.map((comp) => comp.distanceFromTarget),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="show-rentals"
            checked={showRentals}
            onChange={() => setShowRentals(!showRentals)}
          />
          <label htmlFor="show-rentals" className="text-sm flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            Rental Comps ({rentalComps.length})
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="show-sales" checked={showSales} onChange={() => setShowSales(!showSales)} />
          <label htmlFor="show-sales" className="text-sm flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
            Sales Comps ({salesComps.length})
          </label>
        </div>
      </div>

      <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-md">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Target location marker */}
          <Marker position={[centerLat, centerLng]} icon={icons.target}>
            <Popup>
              <div className="p-1">
                <div className="font-medium">Target Location</div>
                <div className="text-xs text-gray-500">Zoning analysis center point</div>
              </div>
            </Popup>
          </Marker>

          {/* Search radius circle */}
          <Circle
            center={[centerLat, centerLng]}
            radius={maxDistance * 1609.34} // Convert miles to meters
            pathOptions={{ fillColor: "blue", fillOpacity: 0.05, color: "blue", weight: 1 }}
          />

          {/* Rental comps markers */}
          {showRentals &&
            rentalComps.map((comp) => (
              <Marker key={`rental-${comp.id}`} position={[comp.lat, comp.lng]} icon={icons.rental}>
                <Popup>
                  <Card className="border-0 shadow-none">
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">{comp.address}</div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                          Rental
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {comp.bedrooms} bd / {comp.bathrooms} ba • {comp.squareFeet.toLocaleString()} sq ft
                      </div>
                      <div className="text-sm font-medium">${comp.monthlyRent.toLocaleString()}/mo</div>
                      <div className="text-xs text-gray-500">${comp.pricePerSqFt.toFixed(2)}/sq ft</div>
                    </div>
                  </Card>
                </Popup>
              </Marker>
            ))}

          {/* Sales comps markers */}
          {showSales &&
            salesComps.map((comp) => (
              <Marker key={`sale-${comp.id}`} position={[comp.lat, comp.lng]} icon={icons.sale}>
                <Popup>
                  <Card className="border-0 shadow-none">
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">{comp.address}</div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                          Sale
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {comp.bedrooms} bd / {comp.bathrooms} ba • {comp.squareFeet.toLocaleString()} sq ft
                      </div>
                      <div className="text-sm font-medium">${comp.salePrice.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">${comp.pricePerSqFt.toFixed(2)}/sq ft</div>
                      <div className="text-xs text-gray-500">Sold: {comp.saleDate}</div>
                    </div>
                  </Card>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  )
}
