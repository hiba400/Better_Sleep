interface GoalsTrackerProps {
  goals: Array<{
    id: string
    name: string
    target: number
    current: number
    unit: string
  }>
}

export default function GoalsTracker({ goals }: GoalsTrackerProps) {
  return (
    <div className="card">
      <h2 className="mb-4 font-semibold">Sleep Goals</h2>
      <div className="space-y-4">
        {goals && goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">{goal.name}</span>
                <span className="text-sm text-muted">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-sm">No goals set yet.</p>
        )}
      </div>
    </div>
  )
}
