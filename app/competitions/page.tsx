import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Competitions - GiG Geni",
  description: "Browse and participate in competitions",
}

export default function CompetitionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Competitions
      </h1>
      <div className="bg-secondary rounded-lg p-8">
        <p className="text-gray-500">
          🚧 Competitions list coming soon...
        </p>
      </div>
    </div>
  )
}