"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Trophy, Award, Bell, Menu, Plus, Info, MessageCircle } from "lucide-react"
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-2 py-2 z-50 overflow-hidden">
        <div className="flex items-center justify-between max-w-full">
          {/* Home */}
          <NavLink 
            href="/" 
            className="flex flex-col items-center p-1 text-xs rounded-lg min-w-0 flex-1"
            activeClassName="bg-orange-50 text-primary"
          >
            <Home className="h-4 w-4 mb-1 flex-shrink-0" />
            <span className="truncate text-[10px] leading-tight">Home</span>
          </NavLink>

          {/* Competitions */}
          <NavLink 
            href="/competitions" 
            className="flex flex-col items-center p-1 text-xs rounded-lg min-w-0 flex-1"
            activeClassName="bg-orange-50 text-primary"
          >
            <Trophy className="h-4 w-4 mb-1 flex-shrink-0" />
            <span className="truncate text-[10px] leading-tight">Compete</span>
          </NavLink>

          {/* Leaderboards */}
          <NavLink 
            href="/leaderboards" 
            className="flex flex-col items-center p-1 text-xs rounded-lg min-w-0 flex-1"
            activeClassName="bg-orange-50 text-primary"
          >
            <Award className="h-4 w-4 mb-1 flex-shrink-0" />
            <span className="truncate text-[10px] leading-tight">Leaders</span>
          </NavLink>

          {/* Notifications */}
          <NavLink 
            href="/notifications" 
            className="flex flex-col items-center p-1 text-xs rounded-lg min-w-0 flex-1"
            activeClassName="bg-orange-50 text-primary"
          >
            <Bell className="h-4 w-4 mb-1 flex-shrink-0" />
            <span className="truncate text-[10px] leading-tight">Alerts</span>
          </NavLink>

          {/* Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex flex-col items-center p-1 text-xs min-w-0 flex-1">
                <Menu className="h-4 w-4 mb-1 flex-shrink-0" />
                <span className="truncate text-[10px] leading-tight">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                <Link href="/about" className="text-lg hover:text-primary" onClick={() => setIsSheetOpen(false)}>
                  About
                </Link>
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
                    <Link href="/profile" className="text-lg hover:text-primary" onClick={() => setIsSheetOpen(false)}>
                      Profile
                    </Link>
                    
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