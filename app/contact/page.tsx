import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - GiG Geni",
  description: "Get in touch with the GiG Geni team",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Contact Us
      </h1>
      <div className="bg-secondary rounded-lg p-8">
        <p className="text-gray-500">
          🚧 Contact form coming soon...
        </p>
      </div>
    </div>
  )
}