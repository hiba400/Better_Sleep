"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative group p-3 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 hover:border-primary/60 transition-all duration-300 shadow-lg hover:shadow-xl"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5">
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-primary animate-spin duration-300 transition-transform" />
        ) : (
          <Moon className="w-5 h-5 text-primary animate-pulse" />
        )}
      </div>
      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  )
}
