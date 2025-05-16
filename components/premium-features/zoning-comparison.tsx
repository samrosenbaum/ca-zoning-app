"use client"

import { useState } from "react"
import { ArrowLeftRight, X, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { zoningData } from "@/lib/zoning-data"
import type { ZoningInfo } from "@/lib/types"

export default function ZoningComparison() {
  const [selectedZonings, setSelectedZonings] = useState<ZoningInfo[]>([])
  const [comparing, setComparing] = useState(false)

  const handleAddZoning = (cityId: string) => {
    const zoning = zoningData.find((z) => `${z.city}-${z.zoningType}` === cityId)
    if (zoning && selectedZonings.length < 3) {
      setSelectedZonings([...selectedZonings, zoning])
    }
  }

  const handleRemoveZoning = (index: number) => {
    const newSelected = [...selectedZonings]
    newSelected.splice(index, 1)
    setSelectedZonings(newSelected)
  }

  const startComparison = () => {
    if (selectedZonings.length >= 2) {
      setComparing(true)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowLeftRight className="mr-2 h-5 w-5" />
          Zoning Comparison Tool
        </CardTitle>
        <CardDescription>
          Compare zoning regulations across different cities to identify the best development opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!comparing ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Select Zoning Districts to Compare (up to 3)</h3>

              <div className="flex flex-wrap gap-2">
                {selectedZonings.map((zoning, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full pl-3 pr-1 py-1">
                    <span className="text-sm mr-1">
                      {zoning.city} ({zoning.zoningType})
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full"
                      onClick={() => handleRemoveZoning(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Select onValueChange={handleAddZoning} disabled={selectedZonings.length >= 3}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add zoning district..." />
                  </SelectTrigger>
                  <SelectContent>
                    {zoningData.map((zoning) => (
                      <SelectItem
                        key={`${zoning.city}-${zoning.zoningType}`}
                        value={`${zoning.city}-${zoning.zoningType}`}
                        disabled={selectedZonings.some(
                          (s) => s.city === zoning.city && s.zoningType === zoning.zoningType,
                        )}
                      >
                        {zoning.city} - {zoning.zoningType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={startComparison} disabled={selectedZonings.length < 2}>
                  Compare
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Why Compare Zoning Districts?</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Identify cities with the most favorable development regulations</li>
                <li>• Compare lot requirements and building restrictions side-by-side</li>
                <li>• Find opportunities for higher density or more flexible uses</li>
                <li>• Make data-driven decisions about where to focus development efforts</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => setComparing(false)}>
                Back to Selection
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Comparison
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 border-b"></th>
                    {selectedZonings.map((zoning, index) => (
                      <th key={index} className="text-left p-2 border-b">
                        <div>
                          <div className="font-medium">{zoning.city}</div>
                          <div className="flex items-center">
                            <Badge
                              variant={
                                zoning.zoningType === "R1" || zoning.zoningType === "RS" || zoning.zoningType === "RH-1"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                zoning.zoningType === "R1" || zoning.zoningType === "RS" || zoning.zoningType === "RH-1"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }
                            >
                              {zoning.zoningType}
                            </Badge>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b font-medium">Minimum Lot Size</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        {zoning.minLotSize.toLocaleString()} sq ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Minimum Lot Width</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        {zoning.minLotWidth} ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Maximum Height</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        {zoning.maxHeight} ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Maximum Coverage</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        {zoning.maxCoverage}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Maximum Stories</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        {zoning.maxStories}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Front Setback</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        {zoning.setbacks.front} ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Rear Setback</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        {zoning.setbacks.rear} ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Side Setback</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        {zoning.setbacks.side} ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Open Space Requirement</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        {zoning.openSpaceReq}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Allowed Uses</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b">
                        <ul className="list-disc list-inside text-sm">
                          {zoning.allowedUses.map((use, i) => (
                            <li key={i}>{use}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-medium">Special Notes</td>
                    {selectedZonings.map((zoning, index) => (
                      <td key={index} className="p-2 border-b text-sm">
                        {zoning.notes}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-700">Analysis Highlights</h4>
              <ul className="text-sm space-y-1 text-blue-600">
                <li>
                  • {selectedZonings[0].city} allows {selectedZonings[0].maxCoverage}% lot coverage vs.{" "}
                  {selectedZonings[1].maxCoverage}% in {selectedZonings[1].city}
                </li>
                <li>
                  • Maximum building height varies by{" "}
                  {Math.abs(selectedZonings[0].maxHeight - selectedZonings[1].maxHeight)} feet between jurisdictions
                </li>
                <li>
                  • {selectedZonings.sort((a, b) => b.minLotSize - a.minLotSize)[0].city} requires the largest minimum
                  lot size at{" "}
                  {selectedZonings.sort((a, b) => b.minLotSize - a.minLotSize)[0].minLotSize.toLocaleString()} sq ft
                </li>
                <li>
                  • {selectedZonings.sort((a, b) => a.setbacks.front - b.setbacks.front)[0].city} has the most favorable
                  front setback requirements
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
