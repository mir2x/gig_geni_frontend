"use client"

import Link from "next/link"
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

// Mock auth state - replace with your auth solution
const mockUser = {
  isLoggedIn: true,
  role: "employer" as "employer" | "employee",
  name: "John Doe",
  avatar: "/placeholder-avatar.jpg"
}

export function DesktopNav() {
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
        {!mockUser.isLoggedIn ? (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/leaderboards">Leaderboards</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact">Contact Us</Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {mockUser.role === "employer" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/competitions/create">Create Competition</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/competitions/manage">Manage Competitions</Link>
                  </DropdownMenuItem>
                </>
              )}
              
              {mockUser.role === "employee" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/competitions/join">Join Competitions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/competitions/my">My Competitions</Link>
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        </div>
      </div>
    </nav>
  )
}