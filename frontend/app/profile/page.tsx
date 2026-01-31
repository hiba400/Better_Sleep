"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface UserProfile {
  id: string
  email: string
  username: string
  role: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        const response = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setProfile(data)
          setUsername(data.username || "")
        } else {
          router.push("/auth/login")
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_id")
    router.push("/")
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setMessage("")

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      })

      if (response.ok) {
        setMessage("Profile updated successfully!")
      } else {
        setMessage("Failed to update profile")
      }
    } catch (err) {
      setMessage("An error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted">Loading profile...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-primary">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SleepBetter</h1>
          <Link href="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card space-y-6">
          <h1>Your Profile</h1>

          {profile && (
            <>
              <div className="space-y-2">
                <p className="text-sm text-muted">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted">Role</p>
                <p className="font-medium capitalize">{profile.role}</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" />
                </div>
                <button type="submit" disabled={isUpdating} className="btn-primary">
                  {isUpdating ? "Updating..." : "Update Profile"}
                </button>
              </form>

              {message && (
                <div
                  className={`p-4 rounded-lg ${message.includes("successfully") ? "bg-green-900 text-success" : "bg-red-900 text-error"}`}
                >
                  {message}
                </div>
              )}

              <button onClick={handleLogout} className="btn-secondary w-full">
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
