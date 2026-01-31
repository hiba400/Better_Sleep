"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { api } from "@/lib/api"

interface Alerte {
  id: number
  message: string
  dateCreation: string
  vue: boolean
  type?: string
  condition?: string
  thresholdHours?: number
  active?: boolean
  utilisateur?: {
    id: number
    email: string
    name: string
  }
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alerte[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createError, setCreateError] = useState("")
  const [createForm, setCreateForm] = useState({
    type: "Sommeil insuffisant",
    condition: "Durée <",
    thresholdHours: 6,
    message: "",
    active: true,
  })
  const router = useRouter()

  // S'assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Toujours retourner un tableau valide - version ultra-sécurisée
  const safeAlerts: Alerte[] = useMemo(() => {
    try {
      if (!alerts) return []
      if (!Array.isArray(alerts)) return []
      
      const result: Alerte[] = []
      for (let i = 0; i < alerts.length; i++) {
        const item = alerts[i]
        if (
          item &&
          typeof item === 'object' &&
          typeof item.id === 'number' &&
          typeof item.message === 'string'
        ) {
          result.push(item as Alerte)
        }
      }
      return result
    } catch (error) {
      console.error("Error processing alerts:", error)
      return []
    }
  }, [alerts])

  // Calculer les statistiques sans utiliser filter
  const stats = useMemo(() => {
    try {
      let total = 0
      let unread = 0
      let read = 0
      
      if (Array.isArray(safeAlerts)) {
        total = safeAlerts.length
        for (let i = 0; i < safeAlerts.length; i++) {
          const alert = safeAlerts[i]
          if (alert && typeof alert === 'object' && 'vue' in alert) {
            if (alert.vue === true) {
              read++
            } else {
              unread++
            }
          }
        }
      }
      
      return { total, unread, read }
    } catch (error) {
      console.error("Error calculating stats:", error)
      return { total: 0, unread: 0, read: 0 }
    }
  }, [safeAlerts])

  const fetchAlerts = useCallback(async () => {
    try {
      if (typeof window === "undefined") {
        setIsLoading(false)
        return
      }

      let storedUserId = localStorage.getItem("user_id")
      if (!storedUserId || isNaN(parseInt(storedUserId, 10))) {
        storedUserId = "1"
        localStorage.setItem("user_id", "1")
      }
      const userId = parseInt(storedUserId, 10)

      if (!userId || isNaN(userId)) {
        console.error("Invalid user ID")
        setAlerts([])
        setIsLoading(false)
        return
      }

      const response = await api.alertes.getAlertes(userId)

      console.log("ALERTS RAW RESPONSE:", response)
      console.log("ALERTS RESPONSE TYPE:", typeof response)
      console.log("ALERTS IS ARRAY:", Array.isArray(response))

      let alertsArray: Alerte[] = []
      if (Array.isArray(response)) {
        alertsArray = response
      } else if (response && typeof response === 'object') {
        if (Array.isArray((response as any).data)) {
          alertsArray = (response as any).data
        } else if (Array.isArray((response as any).alerts)) {
          alertsArray = (response as any).alerts
        }
      }
      
      console.log("FINAL ALERTS ARRAY:", alertsArray)
      setAlerts(alertsArray)
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
      setAlerts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      fetchAlerts()
    }
  }, [isMounted, fetchAlerts])

  const markAsViewed = async (alertId: number) => {
    try {
      await api.alertes.markAsViewed(alertId)
      setAlerts(prev => {
        if (!Array.isArray(prev)) return []
        const result: Alerte[] = []
        for (let i = 0; i < prev.length; i++) {
          const alert = prev[i]
          if (alert && alert.id === alertId) {
            result.push({ ...alert, vue: true })
          } else if (alert) {
            result.push(alert)
          }
        }
        return result
      })
    } catch (error) {
      console.error("Failed to mark alert as viewed:", error)
    }
  }

  const createTestAlert = async () => {
    try {
      setCreateError("")

      if (typeof window === "undefined") {
        return
      }

      let storedUserId = localStorage.getItem("user_id")
      if (!storedUserId || isNaN(parseInt(storedUserId, 10))) {
        storedUserId = "1"
        localStorage.setItem("user_id", "1")
      }
      const userId = parseInt(storedUserId, 10)

      if (!userId || isNaN(userId)) {
        console.error("Invalid user ID", { storedUserId, userId })
        setCreateError("Invalid user ID")
        return
      }

      const condition = (createForm.condition || "").trim()
      const message = (createForm.message || "").trim()

      if (!condition) {
        setCreateError("Condition is required")
        return
      }

      if (!message) {
        setCreateError("Message is required")
        return
      }

      const payload = {
        type: createForm.type,
        condition,
        thresholdHours:
          typeof createForm.thresholdHours === "number"
            ? createForm.thresholdHours
            : null,
        message,
        active: createForm.active,
      }

      const response = await api.alertes.createAlerteJson(userId, payload)
      const newAlert: Alerte = (response as any)?.data ?? response

      if (!newAlert) return

      setAlerts(prev => {
        const arr = Array.isArray(prev) ? prev : []
        return [newAlert, ...arr]
      })

      setIsCreateOpen(false)
      setCreateForm({
        type: "Sommeil insuffisant",
        condition: "Durée <",
        thresholdHours: 6,
        message: "",
        active: true,
      })
    } catch (error) {
      console.error("Failed to create test alert:", error)
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Failed to create alert"
      setCreateError(msg)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return dateString
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return dateString
      }
      return date.toLocaleString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString || ""
    }
  }

  if (!isMounted || isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">🔔 Smart Alerts</h1>
            <p className="text-muted-foreground">
              Personalized alerts based on your sleep patterns
            </p>
          </div>
          <button
            onClick={() => {
              setCreateError("")
              setIsCreateOpen(true)
            }}
            className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80"
          >
            Create Alert
          </button>
        </div>

        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-xl rounded-xl bg-background p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Create Alert</h2>
                <button
                  onClick={() => {
                    setIsCreateOpen(false)
                    setCreateError("")
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  ✕
                </button>
              </div>

              {createError && (
                <div className="mb-4 rounded-lg border border-error bg-error/10 p-3 text-error">
                  {createError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Type</label>
                  <select
                    className="input-premium"
                    value={createForm.type}
                    onChange={e =>
                      setCreateForm(prev => ({ ...prev, type: e.target.value }))
                    }
                  >
                    <option value="Sommeil insuffisant">Sommeil insuffisant</option>
                    <option value="Sommeil excessif">Sommeil excessif</option>
                    <option value="Horaire irrégulier">Horaire irrégulier</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Statut</label>
                  <select
                    className="input-premium"
                    value={createForm.active ? "active" : "inactive"}
                    onChange={e =>
                      setCreateForm(prev => ({ ...prev, active: e.target.value === "active" }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Condition</label>
                  <select
                    className="input-premium"
                    value={createForm.condition}
                    onChange={e =>
                      setCreateForm(prev => ({ ...prev, condition: e.target.value }))
                    }
                  >
                    <option value="Durée <">Durée &lt; X heures</option>
                    <option value="Durée >">Durée &gt; X heures</option>
                    <option value="Horaire irrégulier">Horaire irrégulier</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Seuil (heures)</label>
                  <input
                    className="input-premium"
                    type="number"
                    min={1}
                    max={24}
                    value={createForm.thresholdHours}
                    onChange={e =>
                      setCreateForm(prev => ({
                        ...prev,
                        thresholdHours: Number.parseInt(e.target.value || "0", 10),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium">Message</label>
                <textarea
                  className="input-premium resize-none"
                  rows={4}
                  value={createForm.message}
                  onChange={e =>
                    setCreateForm(prev => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Texte affiché à l’utilisateur"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false)
                    setCreateError("")
                  }}
                  className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createTestAlert}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATISTIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-premium">
            <p className="text-sm text-muted-foreground">Total Alerts</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>

          <div className="card-premium">
            <p className="text-sm text-muted-foreground">Unread</p>
            <p className="text-2xl font-bold">{stats.unread}</p>
          </div>

          <div className="card-premium">
            <p className="text-sm text-muted-foreground">Read</p>
            <p className="text-2xl font-bold">{stats.read}</p>
          </div>
        </div>

        {/* LISTE DES ALERTES */}
        <div className="space-y-4">
          {safeAlerts.length === 0 ? (
            <div className="card-premium text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                No alerts yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start logging your sleep to receive alerts.
              </p>
              <button
                onClick={() => router.push("/sleep-entry")}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Log Sleep
              </button>
            </div>
          ) : (
            safeAlerts.map(alert => {
              if (!alert || typeof alert !== 'object') return null
              return (
                <div
                  key={alert.id}
                  className={`card-premium border-l-4 ${
                    !alert.vue ? "border-warning" : "border-border"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(alert.dateCreation)}
                      </p>
                      <p className={`text-lg ${!alert.vue ? "font-semibold" : ""}`}>
                        {alert.message}
                      </p>
                    </div>

                    {!alert.vue && (
                      <button
                        onClick={() => markAsViewed(alert.id)}
                        className="text-sm text-primary hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
