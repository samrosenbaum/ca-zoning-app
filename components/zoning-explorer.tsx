"use client"

import { useState, useMemo } from "react"
import { Search, Filter, MapIcon, Grid3x3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import ZoningCard from "@/components/zoning-card"
import ZoningDetailModal from "@/components/zoning-detail-modal"
import ZoningMap from "@/components/zoning-map"
import { zoningData } from "@/lib/zoning-data"
import type { ZoningInfo } from "@/lib/types"
import Link from "next/link"

export default function ZoningExplorer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedZoning, setSelectedZoning] = useState<ZoningInfo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"city" | "minLotSize" | "maxHeight">("city")
  const [filterType, setFilterType] = useState<"all" | "R1" | "RL">("all")
  const [activeView, setActiveView] = useState<"grid" | "map">("grid")

  const filteredAndSortedData = useMemo(() => {
    const filtered = zoningData.filter((zoning) => {
      const matchesSearch =
        zoning.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zoning.county.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || zoning.zoningType.startsWith(filterType)
      return matchesSearch && matchesType
    })

    return filtered.sort((a, b) => {
      if (sortBy === "city") return a.city.localeCompare(b.city)
      if (sortBy === "minLotSize") return a.minLotSize - b.minLotSize
      if (sortBy === "maxHeight") return a.maxHeight - b.maxHeight
      return 0
    })
  }, [searchTerm, sortBy, filterType])

  const handleCardClick = (zoning: ZoningInfo) => {
    setSelectedZoning(zoning)
    setIsModalOpen(true)
  }

  const handleMarkerClick = (zoning: ZoningInfo) => {
    setSelectedZoning(zoning)
    setIsModalOpen(true)
  }

  const stats = useMemo(() => {
    const r1Count = zoningData.filter(
      (z) => z.zoningType.startsWith("R1") || z.zoningType === "RS" || z.zoningType === "RH-1",
    ).length
    const rlCount = zoningData.filter((z) => z.zoningType === "RL").length
    const avgLotSize = Math.round(zoningData.reduce((sum, z) => sum + z.minLotSize, 0) / zoningData.length)
    return { r1Count, rlCount, avgLotSize, total: zoningData.length }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">California Residential Zoning</h1>
              <p className="text-sm font-medium text-gray-600">
                Explore R1 and RL zoning regulations across California
              </p>
            </div>
            <Link href="/premium-features">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md font-semibold">
                Unlock Premium Features
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200/60 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold text-gray-600 mb-1">Total Zones</div>
            <div className="text-3xl font-bold text-gray-900 tabular-nums">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold text-blue-700 mb-1">R1 Zones</div>
            <div className="text-3xl font-bold text-blue-900 tabular-nums">{stats.r1Count}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/60 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold text-green-700 mb-1">RL Zones</div>
            <div className="text-3xl font-bold text-green-900 tabular-nums">{stats.rlCount}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/60 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-sm font-semibold text-purple-700 mb-1">Avg. Lot Size</div>
            <div className="text-3xl font-bold text-purple-900 tabular-nums">
              {stats.avgLotSize.toLocaleString()}
              <span className="text-sm font-medium text-purple-600 ml-1">sq ft</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200/60 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by city or county..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="h-11 border-gray-300 font-medium">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city">City Name</SelectItem>
                <SelectItem value="minLotSize">Lot Size</SelectItem>
                <SelectItem value="maxHeight">Max Height</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="h-11 border-gray-300 font-medium">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="R1">R1 Only</SelectItem>
                  <SelectItem value="RL">RL Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* View Toggle and Results */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
          <Tabs value={activeView} onValueChange={(v: any) => setActiveView(v)} className="w-full">
            <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {filteredAndSortedData.length} {filteredAndSortedData.length === 1 ? "Zone" : "Zones"}
                  </h2>
                  {filterType !== "all" && (
                    <Badge variant="secondary" className="font-medium">
                      {filterType} Only
                    </Badge>
                  )}
                </div>
                <TabsList className="bg-gray-100 border border-gray-200">
                  <TabsTrigger
                    value="grid"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                  >
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="map"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
                  >
                    <MapIcon className="w-4 h-4 mr-2" />
                    Map
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="grid" className="p-6 mt-0">
              {filteredAndSortedData.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-3">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 font-medium">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedData.map((zoning) => (
                    <ZoningCard key={zoning.id} zoning={zoning} onClick={() => handleCardClick(zoning)} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="map" className="p-0 mt-0">
              <div className="h-[600px]">
                <ZoningMap zoningData={filteredAndSortedData} onMarkerClick={handleMarkerClick} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedZoning && (
        <ZoningDetailModal
          zoning={selectedZoning}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedZoning(null)
          }}
        />
      )}
    </div>
  )
}
