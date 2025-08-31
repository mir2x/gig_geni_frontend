"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Trophy, Award, Bell, Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NavLink } from "./NavLink"
import { AuthModal } from "@/components/auth/AuthModal"
import { EmailVerificationModal } from "@/components/auth/EmailVerificationModal"
import { useAuthStore } from "@/store/authStore"

export function MobileDock() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAuthSuccess = (email: string, needsVerification: boolean) => {
    if (needsVerification) {
      setVerificationEmail(email);
      setIsAuthModalOpen(false);
      setIsVerificationModalOpen(true);
    } else {
      setIsAuthModalOpen(false);
    }
    setIsSheetOpen(false);
  };

  const handleVerificationComplete = () => {
    setIsVerificationModalOpen(false);
    setVerificationEmail('');
  };

  const handleBackToAuth = () => {
    setIsVerificationModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsSheetOpen(false);
    router.push('/');
  };
  return (
    <div className="lg:hidden">
      {/* Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {/* Home */}
          <NavLink 
            href="/" 
            className="flex flex-col items-center p-2 text-xs rounded-lg"
            activeClassName="bg-orange-50 text-primary"
          >
            <Home className="h-5 w-5 mb-1" />
            Home
          </NavLink>

          {/* Competitions */}
          <NavLink 
            href="/competitions" 
            className="flex flex-col items-center p-2 text-xs rounded-lg"
            activeClassName="bg-orange-50 text-primary"
          >
            <Trophy className="h-5 w-5 mb-1" />
            Competitions
          </NavLink>

          {/* Create (for employers) or Leaderboards */}
          {user && user.role === "employer" ? (
            <NavLink 
              href="/competitions/create" 
              className="flex flex-col items-center p-2 text-xs bg-primary text-white rounded-lg"
              activeClassName="bg-orange-100 text-primary"
            >
              <Plus className="h-6 w-6 mb-1" />
              Create
            </NavLink>
          ) : (
            <NavLink 
              href="/leaderboards" 
              className="flex flex-col items-center p-2 text-xs rounded-lg"
              activeClassName="bg-orange-50 text-primary"
            >
              <Award className="h-5 w-5 mb-1" />
              Leaderboards
            </NavLink>
          )}

          {/* Notifications */}
          <NavLink 
            href="/notifications" 
            className="flex flex-col items-center p-2 text-xs rounded-lg"
            activeClassName="bg-orange-50 text-primary"
          >
            <Bell className="h-5 w-5 mb-1" />
            Notifications
          </NavLink>

          {/* Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex flex-col items-center p-2 text-xs">
                <Menu className="h-5 w-5 mb-1" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                <Link href="/contact" className="text-lg hover:text-primary" onClick={() => setIsSheetOpen(false)}>
                  Contact Us
                </Link>
                
                {!user ? (
                  <button 
                    onClick={() => {
                      setIsSheetOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="text-lg hover:text-primary text-left"
                  >
                    Login
                  </button>
                ) : (
                  <>
                    {user.role === "employer" && (
                      <>
                        <Link href="/competitions/create" className="text-lg hover:text-primary" onClick={() => setIsSheetOpen(false)}>
                          Create Competition
                        </Link>
                        <Link href="/competitions/manage" className="text-lg hover:text-primary" onClick={() => setIsSheetOpen(false)}>
                          Manage Competitions
                        </Link>
                      </>
                    )}
                    
                    {user.role === "employee" && (
                      <>
                        <Link href="/competitions/join" className="text-lg hover:text-primary" onClick={() => setIsSheetOpen(false)}>
                          Join Competitions
                        </Link>
                        <Link href="/competitions/my" className="text-lg hover:text-primary" onClick={() => setIsSheetOpen(false)}>
                          My Competitions
                        </Link>
                      </>
                    )}
                    
                    <hr className="my-4" />
                    <button onClick={handleLogout} className="text-lg hover:text-primary text-left">
                      Logout
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      
      {/* Spacer to prevent content from being hidden behind dock */}
      <div className="h-20" />

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
    </div>
  )
}