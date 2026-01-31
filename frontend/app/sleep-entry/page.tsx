"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { api } from "@/lib/api"

export default function SleepEntryPage() {
  const [formData, setFormData] = useState({
    sleepDate: new Date().toISOString().split("T")[0],
    bedTime: "23:00",
    wakeTime: "07:00",
    quality: 7,
    notes: "",
    userId: 1, // Sera mis à jour depuis localStorage
  })
  const [quickLogMode, setQuickLogMode] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [recentEntries, setRecentEntries] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Récupérer l'ID utilisateur depuis localStorage
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("user_id")
      const userId = storedUserId ? parseInt(storedUserId, 10) : 1
      setFormData(prev => ({ ...prev, userId }))
    }
    fetchRecentEntries()
    loadSmartDefaults()
  }, [])

  const fetchRecentEntries = async () => {
    try {
      if (typeof window === "undefined") return
      
      const storedUserId = localStorage.getItem("user_id")
      const userId = storedUserId ? parseInt(storedUserId, 10) : 1
      
      if (!userId || isNaN(userId)) return
      
      const entries = await api.sleepEntries.getByUserId(userId)
      if (Array.isArray(entries)) {
        setRecentEntries(entries.slice(0, 5)) // Get last 5 entries
      }
    } catch (error) {
      console.error("Failed to fetch recent entries:", error)
    }
  }

  const loadSmartDefaults = () => {
    const lastEntry = localStorage.getItem('last_sleep_entry')
    if (lastEntry) {
      const entry = JSON.parse(lastEntry)
      setFormData(prev => ({
        ...prev,
        bedTime: entry.bedTime || "23:00",
        wakeTime: entry.wakeTime || "07:00",
      }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quality" ? Number.parseInt(value) : value,
    }))

    // Generate smart suggestions based on notes
    if (name === "notes" && value.length > 3) {
      generateSuggestions(value)
    }
  }

  const generateSuggestions = (notes: string) => {
    const suggestions = []
    const lowerNotes = notes.toLowerCase()
    
    if (lowerNotes.includes('caffeine') || lowerNotes.includes('coffee')) {
      suggestions.push("💡 Try to avoid caffeine at least 6 hours before bedtime")
    }
    if (lowerNotes.includes('stress') || lowerNotes.includes('anxious')) {
      suggestions.push("🧘 Consider meditation or deep breathing exercises before bed")
    }
    if (lowerNotes.includes('exercise') || lowerNotes.includes('workout')) {
      suggestions.push("🏃 Great job! Try to exercise earlier in the day for better sleep")
    }
    if (lowerNotes.includes('screen') || lowerNotes.includes('phone')) {
      suggestions.push("📱 Try blue light filters or avoid screens 1 hour before bed")
    }
    
    setSuggestions(suggestions)
  }

  const calculateDuration = (bedTime: string, wakeTime: string): number => {
    const [bedHour, bedMin] = bedTime.split(":").map(Number)
    const [wakeHour, wakeMin] = wakeTime.split(":").map(Number)
    
    let duration = (wakeHour * 60 + wakeMin) - (bedHour * 60 + bedMin)
    if (duration < 0) duration += 24 * 60 // Handle overnight sleep
    
    return duration
  }

  const handleQuickLog = () => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    
    setFormData({
      sleepDate: yesterday.toISOString().split("T")[0],
      bedTime: "23:00",
      wakeTime: "07:00",
      quality: 7,
      notes: "",
      userId: 1,
    })
    setQuickLogMode(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (typeof window === "undefined") {
        setError("Please refresh the page")
        setIsLoading(false)
        return
      }

      // Récupérer l'ID utilisateur depuis localStorage
      const storedUserId = localStorage.getItem("user_id")
      let userId = storedUserId ? parseInt(storedUserId, 10) : formData.userId

      if (!userId || isNaN(userId)) {
        // Si pas d'userId, utiliser 1 par défaut (utilisateur de test)
        userId = 1
        console.warn("No user ID found, using default userId: 1")
      }
      
      console.log("Using userId:", userId)

      const duration = calculateDuration(formData.bedTime, formData.wakeTime)
      
      // Formater la date correctement pour le backend
      const sleepDateStr = formData.sleepDate // Le backend attend une String
      
      const sleepEntryData = {
        userId,
        sleepDate: sleepDateStr,
        bedTime: formData.bedTime,
        wakeTime: formData.wakeTime,
        duration,
        quality: formData.quality,
        notes: formData.notes || "",
      }

      console.log("Sending sleep entry:", sleepEntryData)
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const res = await fetch(`${apiBaseUrl}/api/sleep-entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sleepEntryData),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        throw new Error(`Sleep entry API error (${res.status}): ${errText || res.statusText}`)
      }

      const contentType = res.headers.get("content-type")
      const response = contentType && contentType.includes("application/json")
        ? await res.json()
        : await res.text()
      
      // Save as last entry for smart defaults
      localStorage.setItem('last_sleep_entry', JSON.stringify({
        bedTime: formData.bedTime,
        wakeTime: formData.wakeTime,
      }))
      
      setSuccess("Sleep entry logged successfully! 🎉")
      setFormData({
        sleepDate: new Date().toISOString().split("T")[0],
        bedTime: formData.bedTime, // Keep same times for consistency
        wakeTime: formData.wakeTime,
        quality: 7,
        notes: "",
        userId: userId, // Garder le userId correct
      })
      setSuggestions([])
      
      if (quickLogMode) {
        setTimeout(() => router.push("/dashboard"), 1500)
      } else {
        setTimeout(() => router.push("/dashboard"), 2000)
      }
    } catch (err: any) {
      console.error("Error creating sleep entry:", err)
      console.error("Error details:", {
        message: err?.message,
        stack: err?.stack,
        name: err?.name
      })
      
      let errorMessage = "Failed to log sleep entry"
      
      if (err?.message) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      // Messages d'erreur plus spécifiques
      if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        errorMessage = `Backend not found. Please make sure the backend server is running at ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}`
      } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError") || errorMessage.includes("CORS")) {
        errorMessage = `Cannot connect to backend. Please check:\n1. Backend is running on ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}\n2. CORS is configured correctly\n3. Firewall is not blocking the connection`
      } else if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
        errorMessage = "Server error. Please check the backend logs."
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const useRecentEntry = (entry: any) => {
    setFormData(prev => ({
      ...prev,
      bedTime: entry.bedTime,
      wakeTime: entry.wakeTime,
      quality: entry.quality,
    }))
  }

  const duration = calculateDuration(formData.bedTime, formData.wakeTime)
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        <div className="card-premium">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Log Your Sleep
              </h1>
              <button
                onClick={handleQuickLog}
                className="btn-secondary bg-secondary text-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-all"
              >
                ⚡ Quick Log
              </button>
            </div>
            <p className="text-muted-foreground">Record your sleep data and track your progress</p>
          </div>

          {/* Recent Entries for Quick Access */}
          {recentEntries.length > 0 && !quickLogMode && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Fill from Recent Entries:</h3>
              <div className="flex gap-2 flex-wrap">
                {recentEntries.map((entry, index) => (
                  <button
                    key={index}
                    onClick={() => useRecentEntry(entry)}
                    className="px-3 py-1 bg-secondary/50 text-muted-foreground rounded-lg text-sm hover:bg-secondary/80 transition-all"
                  >
                    {new Date(entry.sleepDate).toLocaleDateString()} - {entry.bedTime} to {entry.wakeTime}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Duration Display */}
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">Calculated Sleep Duration:</span>
              <span className="text-2xl font-bold text-primary">
                {hours}h {minutes}m
              </span>
            </div>
            {duration < 420 && (
              <p className="text-xs text-warning mt-2">⚠️ Less than 7 hours - consider getting more sleep</p>
            )}
            {duration > 540 && (
              <p className="text-xs text-info mt-2">💤 More than 9 hours - ensure this feels right for you</p>
            )}
          </div>

          {error && (
            <div className="bg-error/10 border border-error rounded-lg p-4 text-error mb-6 font-medium">{error}</div>
          )}

          {success && (
            <div className="bg-success/10 border border-success rounded-lg p-4 text-success mb-6 font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <input
                  type="date"
                  name="sleepDate"
                  value={formData.sleepDate}
                  onChange={handleChange}
                  className="input-premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sleep Quality</label>
                <select name="quality" value={formData.quality} onChange={handleChange} className="input-premium">
                  <option value={10}>Excellent</option>
                  <option value={8}>Very Good</option>
                  <option value={7}>Good</option>
                  <option value={5}>Average</option>
                  <option value={3}>Poor</option>
                  <option value={1}>Very Poor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bedtime</label>
                <input
                  type="time"
                  name="bedTime"
                  value={formData.bedTime}
                  onChange={handleChange}
                  className="input-premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Wake Time</label>
                <input
                  type="time"
                  name="wakeTime"
                  value={formData.wakeTime}
                  onChange={handleChange}
                  className="input-premium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-foreground">Sleep Quality</label>
                <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formData.quality}/10
                </span>
              </div>
              <input
                type="range"
                name="quality"
                min="1"
                max="10"
                value={formData.quality}
                onChange={handleChange}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any factors that affected your sleep? (caffeine, exercise, stress...)"
                className="input-premium resize-none"
                rows={4}
              />
            </div>

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h4 className="font-medium text-accent mb-2">💡 Smart Suggestions:</h4>
                <ul className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
            >
              {isLoading ? "Logging..." : quickLogMode ? "⚡ Quick Log Sleep" : "Log Sleep Entry"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
