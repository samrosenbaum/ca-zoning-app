import PremiumFeaturesShowcase from "@/components/premium-features/premium-features-showcase"

export default function PremiumFeaturesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Premium Developer Tools</h1>
        <p className="text-gray-600 mb-8">Unlock powerful features designed specifically for real estate developers</p>

        <PremiumFeaturesShowcase />
      </div>
    </main>
  )
}
