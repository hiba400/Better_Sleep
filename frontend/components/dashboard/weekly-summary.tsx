interface WeeklySummaryProps {
  summary: {
    totalSleep: number
    avgQuality: number
    bestNight: number
    worstNight: number
  }
}

export default function WeeklySummary({ summary }: WeeklySummaryProps) {
  return (
    <div className="card">
      <h2 className="mb-4 font-semibold">Weekly Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-secondary rounded-lg">
          <div className="text-xs text-muted mb-1">Total Sleep</div>
          <div className="text-2xl font-bold text-accent-light">{summary.totalSleep.toFixed(1)}h</div>
        </div>
        <div className="p-3 bg-secondary rounded-lg">
          <div className="text-xs text-muted mb-1">Avg Quality</div>
          <div className="text-2xl font-bold text-accent-light">{summary.avgQuality.toFixed(0)}%</div>
        </div>
        <div className="p-3 bg-secondary rounded-lg">
          <div className="text-xs text-muted mb-1">Best Night</div>
          <div className="text-2xl font-bold text-success">{summary.bestNight.toFixed(1)}h</div>
        </div>
        <div className="p-3 bg-secondary rounded-lg">
          <div className="text-xs text-muted mb-1">Worst Night</div>
          <div className="text-2xl font-bold text-warning">{summary.worstNight.toFixed(1)}h</div>
        </div>
      </div>
    </div>
  )
}
