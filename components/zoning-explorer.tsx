"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Filter, SlidersHorizontal, List, MapIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ZoningCard from "@/components/zoning-card"
import ZoningDetailModal from "@/components/zoning-detail-modal"
import ZoningMap from "@/components/zoning-map"
import { zoningData } from "@/lib/zoning-data"
import type { ZoningInfo } from "@/lib/types"

export default function ZoningExplorer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [zoningType, setZoningType] = useState("all")
  const [sortBy, setSortBy] = useState("city")
  const [filteredData, setFilteredData] = useState<ZoningInfo[]>(zoningData)
  const [selectedZoning, setSelectedZoning] = useState<ZoningInfo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState("list")

  useEffect(() => {
    let result = zoningData

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.county.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by zoning type
    if (zoningType !== "all") {
      result = result.filter((item) => item.zoningType === zoningType)
    }

    // Sort data
    result = [...result].sort((a, b) => {
      if (sortBy === "city") {
        return a.city.localeCompare(b.city)
      } else if (sortBy === "county") {
        return a.county.localeCompare(b.county)
      } else if (sortBy === "lotSize") {
        return a.minLotSize - b.minLotSize
      } else if (sortBy === "maxHeight") {
        return a.maxHeight - b.maxHeight
      }
      return 0
    })

    setFilteredData(result)
  }, [searchTerm, zoningType, sortBy])

  const handleCardClick = (zoning: ZoningInfo) => {
    setSelectedZoning(zoning)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by city or county..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={zoningType} onValueChange={setZoningType}>
          <SelectTrigger>
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by zoning type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zoning Types</SelectItem>
            <SelectItem value="R1">R1 - Residential One</SelectItem>
            <SelectItem value="RL">RL - Residential Low</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <span>Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="city">City</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="county">County</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lotSize">Minimum Lot Size</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="maxHeight">Maximum Height</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-center mb-4">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="list" className="flex items-center">
              <List className="w-4 h-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <MapIcon className="w-4 h-4 mr-2" />
              Map View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((zoning) => (
              <ZoningCard
                key={`${zoning.city}-${zoning.zoningType}`}
                zoning={zoning}
                onClick={() => handleCardClick(zoning)}
              />
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No results found</h3>
                <p className="text-gray-500 text-center mt-2">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <ZoningMap zoningData={filteredData} onMarkerClick={handleCardClick} />
      )}

      {selectedZoning && (
        <ZoningDetailModal zoning={selectedZoning} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
