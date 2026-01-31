"use client"

import { useState } from "react"

interface Alert {
  id: string
  message: string
  severity: string
  isViewed: boolean
  explanation?: string
  reason?: string
  sleepDataLink?: string
}

interface AlertsListProps {
  alerts?: Alert[]
}

export default function AlertsList({ alerts }: AlertsListProps) {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)

  if (!alerts || alerts.length === 0) {
    return (
      <div className="card-premium text-center py-8">
        <div className="text-4xl mb-3">✨</div>
        <p className="text-muted-foreground font-medium">Your sleep looks great!</p>
        <p className="text-sm text-muted-foreground mt-1">No alerts at this time. Keep maintaining your routine.</p>
      </div>
    )
  }

  const toggleExpand = (alertId: string) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId)
  }

  return (
    <div className="card-premium">
      <h2 className="text-xl font-bold text-foreground mb-6">Recent Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 transition-all ${
              alert.severity === "critical"
                ? "border-l-error bg-error/5 border border-error/20"
                : alert.severity === "warning"
                  ? "border-l-warning bg-warning/5 border border-warning/20"
                  : "border-l-accent bg-accent/5 border border-accent/20"
            }`}
          >
            <div className="flex gap-3">
              <div className="text-xl flex-shrink-0">
                {alert.severity === "critical" ? "🔴" : alert.severity === "warning" ? "⚠️" : "ℹ️"}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{alert.severity} Alert</p>
                  </div>
                  {(alert.explanation || alert.reason || alert.sleepDataLink) && (
                    <button
                      onClick={() => toggleExpand(alert.id)}
                      className="ml-2 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      {expandedAlert === alert.id ? "▼ Hide Details" : "▶ Show Details"}
                    </button>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedAlert === alert.id && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                    {alert.explanation && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                          <span>💬</span> Message Explicatif
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{alert.explanation}</p>
                      </div>
                    )}

                    {alert.reason && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                          <span>🔍</span> Raison de l'Alerte
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{alert.reason}</p>
                      </div>
                    )}

                    {alert.sleepDataLink && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                          <span>📊</span> Lien avec les Données de Sommeil
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{alert.sleepDataLink}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
