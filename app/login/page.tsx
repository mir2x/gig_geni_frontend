import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - GiG Geni",
  description: "Sign in to your GiG Geni account",
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Login
        </h1>
        <div className="bg-secondary rounded-lg p-8">
          <p className="text-gray-500 text-center">
            🚧 Login form coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}