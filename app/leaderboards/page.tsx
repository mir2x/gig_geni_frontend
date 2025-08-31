import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leaderboards - GiG Geni",
  description: "View competition leaderboards and rankings",
}

export default function LeaderboardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Leaderboards
      </h1>
      <div className="bg-secondary rounded-lg p-8">
        <p className="text-gray-500">
          🚧 Competition leaderboards coming soon...
        </p>
      </div>
    </div>
  )
}