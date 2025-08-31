import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notifications - GiG Geni",
  description: "View your notifications and updates",
}

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Notifications
      </h1>
      <div className="bg-secondary rounded-lg p-8">
        <p className="text-gray-500">
          🚧 Notifications center coming soon...
        </p>
      </div>
    </div>
  )
}