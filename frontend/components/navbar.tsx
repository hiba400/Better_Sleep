"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { ThemeToggle } from "./theme-toggle"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_id")
    router.push("/")
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className="border-b border-border/50 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
              Z
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SleepBetter
            </span>
          </Link>

          <button
            className="md:hidden text-foreground hover:text-primary transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          <div
            className={`${
              isOpen ? "block" : "hidden"
            } md:block absolute md:relative top-16 md:top-0 left-0 md:left-auto right-0 md:right-0 bg-card md:bg-transparent border-b md:border-0 border-border md:flex gap-1 md:gap-4 p-2 md:p-0 items-center`}
          >
            <Link
              href="/dashboard"
              className={`block md:inline px-3 py-2 rounded-lg transition-all font-medium ${
                isActive("/dashboard")
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/analytics"
              className={`block md:inline px-3 py-2 rounded-lg transition-all font-medium ${
                isActive("/analytics")
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/goals"
              className={`block md:inline px-3 py-2 rounded-lg transition-all font-medium ${
                isActive("/goals")
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Goals
            </Link>
            <Link
              href="/advice"
              className={`block md:inline px-3 py-2 rounded-lg transition-all font-medium ${
                isActive("/advice")
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Advice
            </Link>
            <Link
              href="/alerts"
              className={`block md:inline px-3 py-2 rounded-lg transition-all font-medium ${
                isActive("/alerts")
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Alerts
            </Link>
            <Link
              href="/sleep-entry"
              className={`block md:inline px-3 py-2 rounded-lg transition-all font-medium ${
                isActive("/sleep-entry")
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Log Sleep
            </Link>
            <Link
              href="/profile"
              className={`block md:inline px-3 py-2 rounded-lg transition-all font-medium ${
                isActive("/profile")
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              Profile
            </Link>
            <div className="hidden md:block md:ml-auto">
              <ThemeToggle />
            </div>
            <div className="md:hidden block w-full py-2 border-t border-border/30">
              <ThemeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="block md:inline w-full md:w-auto px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-all font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
