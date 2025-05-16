export interface ZoningInfo {
  city: string
  county: string
  zoningType: "R1" | "RL"
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
