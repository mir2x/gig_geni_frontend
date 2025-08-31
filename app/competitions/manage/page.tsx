import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Competitions - GiG Geni",
  description: "Manage your created competitions",
}

export default function ManageCompetitionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Manage Competitions
      </h1>
      <div className="bg-secondary rounded-lg p-8">
        <p className="text-gray-500">
          🚧 Competition management dashboard coming soon...
        </p>
        <p className="text-sm text-gray-400 mt-2">
          (Employer only page)
        </p>
      </div>
    </div>
  )
}