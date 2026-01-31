"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import SleepChart from "@/components/dashboard/sleep-chart"
import AlertsList from "@/components/dashboard/alerts-list"
import AdvicePanel from "@/components/dashboard/advice-panel"
import GoalsTracker from "@/components/dashboard/goals-tracker"
import WeeklySummary from "@/components/dashboard/weekly-summary"
import { api } from "@/lib/api"
import { SmartAlertsService } from "@/lib/smart-alerts"

interface DashboardData {
  stats: {
    avgSleep: number
    lastNightSleep: number
    qualityScore: number
    shortNights: number
  }
  alerts: Array<{
    id: string
    message: string
    severity: string
    isViewed: boolean
    explanation?: string
    reason?: string
    sleepDataLink?: string
  }>
  advice: Array<{
    id: string
    message: string
    priority: number
  }>
  goals: Array<{
    id: string
    name: string
    target: number
    current: number
    unit: string
  }>
  weeklySummary: {
    totalSleep: number
    avgQuality: number
    bestNight: number
    worstNight: number
  }
}

interface SmartAlert {
  id: string
  type: 'warning' | 'info' | 'success' | 'critical'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  category: 'sleep_debt' | 'quality_decline' | 'consistency' | 'achievement' | 'recommendation'
  actionable: boolean
  actionText?: string
  actionUrl?: string
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [animationStates, setAnimationStates] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        // Test backend connection
        try {
          const backendTest = await api.test.getTest()
          console.log("Backend connection successful:", backendTest)
        } catch (backendError) {
          console.error("Backend connection failed:", backendError)
        }

        // Fetch sleep entries for smart alerts
        try {
          const userId = 1 // Temporary hardcoded user ID
          const sleepEntries = await api.sleepEntries.getByUserId(userId)
          const alerts = SmartAlertsService.generateAlerts(sleepEntries)
          setSmartAlerts(alerts)
        } catch (error) {
          console.error("Failed to fetch sleep entries:", error)
        }

        const response = await fetch("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const dashboardData = await response.json()
          setData(dashboardData)

          Object.keys(dashboardData).forEach((key, index) => {
            setTimeout(() => {
              setAnimationStates((prev: any) => ({ ...prev, [key]: true }))
            }, index * 150)
          })
        } else {
          router.push("/auth/login")
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted) {
      fetchDashboardData()
      const interval = setInterval(fetchDashboardData, 30000)
      return () => clearInterval(interval)
    }
  }, [router, mounted])

  const handleAlertAction = (alertUrl: string) => {
    router.push(alertUrl)
  }

  const markAlertAsRead = (alertId: string) => {
    setSmartAlerts(SmartAlertsService.markAsRead(alertId, smartAlerts))
  }

  const unreadAlertsCount = SmartAlertsService.getUnreadCount(smartAlerts)

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="text-muted-foreground">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {data && (
            <>
              <div className={animationStates.stats ? "scale-in" : "scale-50 opacity-0"}>
                <DashboardStats stats={data.stats} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className={animationStates.chart ? "fade-in" : "opacity-0"}>
                    <SleepChart />
                  </div>
                  <div className={animationStates.summary ? "slide-in" : "opacity-0"}>
                    <WeeklySummary summary={data.weeklySummary} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className={animationStates.advice ? "fade-in" : "opacity-0"}>
                    <AdvicePanel advice={data.advice} />
                  </div>
                  <div className={animationStates.goals ? "scale-in" : "opacity-0"}>
                    <GoalsTracker goals={data.goals} />
                  </div>
                </div>
              </div>

              <div className={animationStates.alerts ? "fade-in" : "opacity-0"}>
                <AlertsList alerts={data.alerts} />
              </div>

              {/* Smart Alerts Section */}
              {smartAlerts.length > 0 && (
                <div className={animationStates.smartAlerts ? "fade-in" : "opacity-0"}>
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold">🔔 Smart Alerts</h2>
                      {unreadAlertsCount > 0 && (
                        <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                          {unreadAlertsCount} new
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      {smartAlerts.slice(0, 5).map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-lg border ${
                            alert.type === 'critical' ? 'bg-destructive/10 border-destructive/20' :
                            alert.type === 'warning' ? 'bg-warning/10 border-warning/20' :
                            alert.type === 'success' ? 'bg-success/10 border-success/20' :
                            'bg-info/10 border-info/20'
                          } ${!alert.isRead ? 'font-semibold' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm ${
                                alert.type === 'critical' ? 'text-destructive' :
                                alert.type === 'warning' ? 'text-warning' :
                                alert.type === 'success' ? 'text-success' :
                                'text-info'
                              }`}>
                                {alert.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {alert.message}
                              </p>
                              {alert.actionable && alert.actionText && (
                                <button
                                  onClick={() => handleAlertAction(alert.actionUrl!)}
                                  className="text-xs text-primary hover:underline mt-2"
                                >
                                  {alert.actionText} →
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!alert.isRead && (
                                <button
                                  onClick={() => markAlertAsRead(alert.id)}
                                  className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                  Mark as read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {smartAlerts.length > 5 && (
                        <button className="text-sm text-primary hover:underline">
                          View all {smartAlerts.length} alerts →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
