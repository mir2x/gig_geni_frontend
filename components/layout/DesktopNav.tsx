"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavLink } from "./NavLink"
import { AuthModal } from "@/components/auth/AuthModal"
import { EmailVerificationModal } from "@/components/auth/EmailVerificationModal"
import { useAuthStore } from "@/store/authStore"

export function DesktopNav() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')

  const handleAuthSuccess = (email: string, needsVerification: boolean) => {
    if (needsVerification) {
      setVerificationEmail(email)
      setIsAuthModalOpen(false)
      setIsVerificationModalOpen(true)
    } else {
      setIsAuthModalOpen(false)
    }
  }

  const handleVerificationComplete = () => {
    setIsVerificationModalOpen(false)
    setVerificationEmail('')
  }

  const handleBackToAuth = () => {
    setIsVerificationModalOpen(false)
    setIsAuthModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="hidden lg:flex w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            GiG Geni
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="flex items-center space-x-8">
          <NavLink href="/" className="px-3 py-2 rounded-lg" activeClassName="bg-orange-50 text-primary">Home</NavLink>
          <NavLink href="/competitions" className="px-3 py-2 rounded-lg" activeClassName="bg-orange-50 text-primary">Competitions</NavLink>
          <NavLink href="/leaderboards" className="px-3 py-2 rounded-lg" activeClassName="bg-orange-50 text-primary">Leaderboards</NavLink>
          <NavLink href="/contact" className="px-3 py-2 rounded-lg" activeClassName="bg-orange-50 text-primary">Contact Us</NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {!user ? (
                <>
                  <DropdownMenuItem onClick={() => setIsAuthModalOpen(true)}>
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsAuthModalOpen(true)}>
                    Sign Up
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {user.role === "employer" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/competitions/create">Create Competition</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/competitions/manage">Manage Competitions</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  {user.role === "employee" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/competitions/join">Join Competitions</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/competitions/my">My Competitions</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                </>
              )}
              
              <DropdownMenuItem asChild>
                <Link href="/leaderboards">Leaderboards</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact">Contact Us</Link>
              </DropdownMenuItem>
              
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={handleVerificationComplete}
        email={verificationEmail}
        onBackToAuth={handleBackToAuth}
      />
    </nav>
  )
}