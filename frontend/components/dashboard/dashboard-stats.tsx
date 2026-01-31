"use client"

interface DashboardStatsProps {
  stats: {
    avgSleep: number
    lastNightSleep: number
    qualityScore: number
    shortNights: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card-premium">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Average Sleep</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {stats.avgSleep.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">hours per night</div>
          </div>
          <div className="text-3xl">😴</div>
        </div>
      </div>

      <div className="card-premium">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Last Night</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {stats.lastNightSleep.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">hours</div>
          </div>
          <div className="text-3xl">🌙</div>
        </div>
      </div>

      <div className="card-premium">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Quality Score</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {stats.qualityScore.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">out of 100</div>
          </div>
          <div className="text-3xl">⭐</div>
        </div>
      </div>

      <div className="card-premium">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-2 font-medium">Short Nights</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-warning to-error bg-clip-text text-transparent">
              {stats.shortNights}
            </div>
            <div className="text-xs text-muted-foreground mt-2">this month</div>
          </div>
          <div className="text-3xl">⚠️</div>
        </div>
      </div>
    </div>
  )
}
