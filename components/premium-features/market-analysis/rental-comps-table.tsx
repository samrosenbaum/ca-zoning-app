"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ChevronDown, ExternalLink, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { RentalComp } from "@/lib/types"

interface RentalCompsTableProps {
  comps: RentalComp[]
}

export default function RentalCompsTable({ comps }: RentalCompsTableProps) {
  const [sortField, setSortField] = useState<keyof RentalComp>("pricePerSqFt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: keyof RentalComp) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedComps = [...comps].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Rental Comparables</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Export <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export to CSV</DropdownMenuItem>
            <DropdownMenuItem>Export to PDF</DropdownMenuItem>
            <DropdownMenuItem>Add to Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Address</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("propertyType")} className="p-0 h-auto font-medium">
                  Property Type
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("bedrooms")} className="p-0 h-auto font-medium">
                  Beds/Baths
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("squareFeet")} className="p-0 h-auto font-medium">
                  Sq Ft
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("monthlyRent")} className="p-0 h-auto font-medium">
                  Monthly Rent
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  <Button variant="ghost" onClick={() => handleSort("pricePerSqFt")} className="p-0 h-auto font-medium">
                    Price/Sq Ft
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="ml-1 h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">Monthly rental price per square foot</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("distanceFromTarget")}
                  className="p-0 h-auto font-medium"
                >
                  Distance
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("listedDate")} className="p-0 h-auto font-medium">
                  Listed Date
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedComps.map((comp) => (
              <TableRow key={comp.id}>
                <TableCell className="font-medium">{comp.address}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {comp.propertyType.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {comp.bedrooms} bd / {comp.bathrooms} ba
                </TableCell>
                <TableCell>{comp.squareFeet.toLocaleString()}</TableCell>
                <TableCell>${comp.monthlyRent.toLocaleString()}</TableCell>
                <TableCell>${comp.pricePerSqFt.toFixed(2)}</TableCell>
                <TableCell>{comp.distanceFromTarget.toFixed(1)} mi</TableCell>
                <TableCell>{comp.listedDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View listing</span>
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500 italic">
        {comps.length} rental comparables found within {comps.length > 0 ? comps[0].distanceFromTarget.toFixed(1) : "0"}{" "}
        miles
      </div>
    </div>
  )
}
