"use client"

interface Advice {
  id: string
  message: string
  priority: number
}

interface AdvicePanelProps {
  advice: Advice[]
}

export default function AdvicePanel({ advice }: AdvicePanelProps) {
  return (
    <div className="card-premium">
      <h3 className="text-lg font-bold text-foreground mb-6">Personalized Tips</h3>
      <div className="space-y-4">
        {advice && advice.length > 0 ? (
          advice.map((tip, idx) => (
            <div key={tip.id} className="flex gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition">
              <div className="text-lg flex-shrink-0">
                {idx === 0 ? "🌙" : idx === 1 ? "🧘" : idx === 2 ? "⏰" : "💤"}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip.message}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No advice available yet.</p>
        )}
      </div>
    </div>
  )
}
