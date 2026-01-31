"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { api } from "@/lib/api"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"

interface SleepEntry {
  id: number
  sleepDate: string
  bedTime: string
  wakeTime: string
  duration: number
  quality: number
  notes: string
}

interface SleepStats {
  averageDuration: number
  averageQuality: number
}

export default function AnalyticsPage() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [stats, setStats] = useState<SleepStats | null>(null)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("week")
  const router = useRouter()

  useEffect(() => {
    fetchSleepData()
  }, [timeRange])

  const fetchSleepData = async () => {
    try {
      let storedUserId = localStorage.getItem("user_id")
      if (!storedUserId || isNaN(parseInt(storedUserId, 10))) {
        storedUserId = "1"
        localStorage.setItem("user_id", "1")
      }
      const userId = parseInt(storedUserId, 10)

      const entries = await api.sleepEntries.getByUserId(userId)
      const statsData = await api.sleepEntries.getStats(userId)
      
      // Fetch AI insights from backend
      try {
        const insightsData = await api.advice.getAdvice(userId)
        setAiInsights(insightsData)
      } catch (error) {
        console.error("Failed to fetch AI insights:", error)
      }
      
      setSleepEntries(entries || [])
      // Ensure stats has default values if null
      setStats(statsData || {
        averageDuration: null,
        averageQuality: null
      })
    } catch (error) {
      console.error("Failed to fetch sleep data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatChartData = () => {
    return sleepEntries.map(entry => ({
      date: new Date(entry.sleepDate).toLocaleDateString(),
      hours: Math.round(entry.duration / 60 * 10) / 10,
      quality: entry.quality,
      bedTime: entry.bedTime,
      wakeTime: entry.wakeTime,
    })).reverse()
  }

  const getQualityDistribution = () => {
    const distribution = [
      { name: 'Poor (1-3)', value: 0, color: '#ef4444' },
      { name: 'Average (4-6)', value: 0, color: '#f59e0b' },
      { name: 'Good (7-8)', value: 0, color: '#10b981' },
      { name: 'Excellent (9-10)', value: 0, color: '#3b82f6' },
    ]

    sleepEntries.forEach(entry => {
      if (entry.quality <= 3) distribution[0].value++
      else if (entry.quality <= 6) distribution[1].value++
      else if (entry.quality <= 8) distribution[2].value++
      else distribution[3].value++
    })

    return distribution.filter(d => d.value > 0)
  }

  const getSleepPatterns = () => {
    const patterns = [
      { day: 'Monday', avgHours: 0, avgQuality: 0, count: 0 },
      { day: 'Tuesday', avgHours: 0, avgQuality: 0, count: 0 },
      { day: 'Wednesday', avgHours: 0, avgQuality: 0, count: 0 },
      { day: 'Thursday', avgHours: 0, avgQuality: 0, count: 0 },
      { day: 'Friday', avgHours: 0, avgQuality: 0, count: 0 },
      { day: 'Saturday', avgHours: 0, avgQuality: 0, count: 0 },
      { day: 'Sunday', avgHours: 0, avgQuality: 0, count: 0 },
    ]

    sleepEntries.forEach(entry => {
      const dayIndex = new Date(entry.sleepDate).getDay()
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1 // Adjust for Monday start
      
      patterns[adjustedIndex].avgHours += entry.duration / 60
      patterns[adjustedIndex].avgQuality += entry.quality
      patterns[adjustedIndex].count++
    })

    return patterns.map(p => ({
      day: p.day,
      avgHours: p.count > 0 ? Math.round(p.avgHours / p.count * 10) / 10 : 0,
      avgQuality: p.count > 0 ? Math.round(p.avgQuality / p.count * 10) / 10 : 0,
    }))
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  const chartData = formatChartData()
  const qualityDistribution = getQualityDistribution()
  const sleepPatterns = getSleepPatterns()

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground">Deep insights into your sleep patterns and trends</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-premium">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Sleep Duration</h3>
              <div className="text-3xl font-bold text-primary">
                {stats.averageDuration != null ? `${Math.round(stats.averageDuration / 60 * 10) / 10}h` : 'N/A'}
              </div>
            </div>
            <div className="card-premium">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Quality</h3>
              <div className="text-3xl font-bold text-accent">
                {stats.averageQuality != null ? `${Math.round(stats.averageQuality * 10) / 10}/10` : 'N/A'}
              </div>
            </div>
            <div className="card-premium">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Entries</h3>
              <div className="text-3xl font-bold text-secondary">
                {sleepEntries.length}
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sleep Duration Trend */}
          <div className="card-premium">
            <h3 className="text-lg font-semibold mb-4">Sleep Duration Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="hours" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep Quality Trend */}
          <div className="card-premium">
            <h3 className="text-lg font-semibold mb-4">Sleep Quality Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quality Distribution */}
          <div className="card-premium">
            <h3 className="text-lg font-semibold mb-4">Sleep Quality Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={qualityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {qualityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Patterns */}
          <div className="card-premium">
            <h3 className="text-lg font-semibold mb-4">Weekly Sleep Patterns</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sleepPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgHours" fill="#3b82f6" name="Avg Hours" />
                <Bar dataKey="avgQuality" fill="#10b981" name="Avg Quality" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="card-premium">
          <h3 className="text-lg font-semibold mb-4">🤖 AI-Powered Insights</h3>
          <div className="space-y-4">
            {aiInsights ? (
              <>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary mb-2">🎯 Personalized Recommendation</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {aiInsights.conseilPrincipal}
                  </p>
                  <div className="text-xs text-primary italic">
                    💡 Based on your recent sleep patterns
                  </div>
                </div>
                
                {aiInsights.conseilsAdditionnels && aiInsights.conseilsAdditionnels.length > 0 && (
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <h4 className="font-medium text-accent mb-2">📋 Additional Tips</h4>
                    <ul className="space-y-2">
                      {aiInsights.conseilsAdditionnels.map((tip: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-accent">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <h4 className="font-medium text-secondary mb-2">🔄 Loading Insights...</h4>
                <p className="text-sm text-muted-foreground">
                  Analyzing your sleep patterns to generate personalized recommendations.
                </p>
              </div>
            )}
            
            {/* Fallback insights if no data */}
            <div className="p-4 bg-info/10 rounded-lg border border-info/20">
              <h4 className="font-medium text-info mb-2">📊 Sleep Analysis Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Average Duration: </span>
                  <span className="font-medium">{stats && stats.averageDuration != null ? `${(stats.averageDuration / 60).toFixed(1)} hours` : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Average Quality: </span>
                  <span className="font-medium">{stats && stats.averageQuality != null ? `${stats.averageQuality.toFixed(1)}/10` : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Entries: </span>
                  <span className="font-medium">{sleepEntries.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Data Range: </span>
                  <span className="font-medium">{timeRange}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
