"use client"

import { useState } from "react"
import { MapPin, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PropertySearch() {
  const [searchType, setSearchType] = useState("address")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock search results
      setSearchResults([
        {
          address: "123 Main St, Los Angeles, CA 90001",
          apn: "1234-567-890",
          zoningCode: "R1",
          lotSize: 7500,
          ownerName: "Smith Family Trust",
          lastSale: "05/15/2021",
          lastSaleAmount: "$950,000",
          taxAssessment: "$875,000",
        },
        {
          address: "456 Oak Ave, Los Angeles, CA 90001",
          apn: "1234-567-891",
          zoningCode: "R1",
          lotSize: 6200,
          ownerName: "Johnson LLC",
          lastSale: "11/03/2020",
          lastSaleAmount: "$875,000",
          taxAssessment: "$820,000",
        },
        {
          address: "789 Pine St, Los Angeles, CA 90001",
          apn: "1234-567-892",
          zoningCode: "RL",
          lotSize: 8100,
          ownerName: "Garcia Investments",
          lastSale: "07/22/2019",
          lastSaleAmount: "$1,050,000",
          taxAssessment: "$980,000",
        },
      ])
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="apn">APN / Parcel</TabsTrigger>
              <TabsTrigger value="owner">Owner Name</TabsTrigger>
            </TabsList>

            <TabsContent value="address" className="space-y-4 pt-4">
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Enter address..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Radius</Label>
                  <RadioGroup defaultValue="property" className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="property" id="property" />
                      <Label htmlFor="property">Property Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quarter" id="quarter" />
                      <Label htmlFor="quarter">¼ Mile</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="half" id="half" />
                      <Label htmlFor="half">½ Mile</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Property Type</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Properties</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed">Mixed Use</SelectItem>
                      <SelectItem value="vacant">Vacant Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Include Data</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="zoning" defaultChecked />
                    <label htmlFor="zoning" className="text-sm">
                      Zoning
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tax" defaultChecked />
                    <label htmlFor="tax" className="text-sm">
                      Tax Data
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="permits" />
                    <label htmlFor="permits" className="text-sm">
                      Permits
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sales" />
                    <label htmlFor="sales" className="text-sm">
                      Sales History
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="apn" className="pt-4">
              <div className="flex space-x-2">
                <Input placeholder="Enter Assessor's Parcel Number (APN)..." />
                <Button>Search</Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Format: XXX-XXX-XXX or XXXXXXXXX (without dashes)</p>
            </TabsContent>

            <TabsContent value="owner" className="pt-4">
              <div className="flex space-x-2">
                <Input placeholder="Enter owner name..." />
                <Button>Search</Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Search by individual name or business entity</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Search Results</h3>

          {searchResults.map((result, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{result.address}</h4>
                      <div className="text-sm text-gray-500">APN: {result.apn}</div>
                    </div>
                    <Badge
                      variant={result.zoningCode === "R1" ? "default" : "secondary"}
                      className={result.zoningCode === "R1" ? "bg-blue-500" : "bg-green-500"}
                    >
                      {result.zoningCode}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                  <div>
                    <div className="text-xs text-gray-500">Lot Size</div>
                    <div className="font-medium">{result.lotSize.toLocaleString()} sq ft</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Owner</div>
                    <div className="font-medium">{result.ownerName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Last Sale</div>
                    <div className="font-medium">{result.lastSale}</div>
                    <div className="text-xs">{result.lastSaleAmount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Tax Assessment</div>
                    <div className="font-medium">{result.taxAssessment}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-4 py-2">
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Property Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
