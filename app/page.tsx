import ZoningExplorer from "@/components/zoning-explorer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">California Residential Zoning Explorer</h1>
        <p className="text-gray-600 text-center mb-8">
          Explore R1 (Residential One) and RL (Residential Low) zoning information across California
        </p>
        <ZoningExplorer />
      </div>
    </main>
  )
}
