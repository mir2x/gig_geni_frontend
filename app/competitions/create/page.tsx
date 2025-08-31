import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Competition - GiG Geni",
  description: "Create a new competition for employees",
}

export default function CreateCompetitionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Create Competition
      </h1>
      <div className="bg-secondary rounded-lg p-8">
        <p className="text-gray-500">
          🚧 Competition creation form coming soon...
        </p>
        <p className="text-sm text-gray-400 mt-2">
          (Employer only page)
        </p>
      </div>
    </div>
  )
}