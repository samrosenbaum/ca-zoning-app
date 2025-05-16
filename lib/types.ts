export interface ZoningInfo {
  city: string
  county: string
  zoningType: "R1" | "RL" | "RH-1" | "RS" | "RS-1" | "RS-5" | "R1-7000" | "R1-8" | "R1-N"
  minLotSize: number
  minLotWidth: number
  minLotDepth: number
  maxHeight: number
  maxCoverage: number
  maxStories: number
  setbacks: {
    front: number
    rear: number
    side: number
  }
  allowedUses: string[]
  openSpaceReq: number
  notes: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface RentalComp {
  id: string
  address: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  monthlyRent: number
  pricePerSqFt: number
  distanceFromTarget: number
  listedDate: string
  lat: number
  lng: number
}

export interface SalesComp {
  id: string
  address: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  squareFeet: number
  salePrice: number
  pricePerSqFt: number
  capRate?: number
  distanceFromTarget: number
  saleDate: string
  lat: number
  lng: number
}

export interface MarketTrend {
  month: string
  propertyType: string
  salePrice: number
  rentalPrice: number
}

// Add these new interfaces for the approval timeline data

export interface ApprovalTimelineDataPoint {
  city: string
  county: string
  projectType: "single-family" | "multi-family" | "mixed-use" | "commercial" | "adu"
  projectSize: "small" | "medium" | "large"
  approvalType: "building-permit" | "conditional-use" | "zoning-variance" | "design-review" | "environmental-review"
  durationDays: number
  startDate: string
  endDate: string
  outcome: "approved" | "denied" | "withdrawn"
  complexity: number // 1-10 scale
  id: string
}

export interface TimelineStage {
  name: string
  avgDuration: number
  description: string
  riskLevel: "low" | "medium" | "high"
  order: number
}
