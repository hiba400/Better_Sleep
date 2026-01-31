"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const mockData = [
  { date: "Mon", hours: 6.5, quality: 65 },
  { date: "Tue", hours: 7.2, quality: 72 },
  { date: "Wed", hours: 5.8, quality: 55 },
  { date: "Thu", hours: 8.1, quality: 81 },
  { date: "Fri", hours: 6.9, quality: 68 },
  { date: "Sat", hours: 9.2, quality: 92 },
  { date: "Sun", hours: 7.5, quality: 75 },
]

export default function SleepChart() {
  return (
    <div className="card-premium">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Weekly Sleep Overview</h2>
          <p className="text-sm text-muted-foreground">Track your sleep hours and quality score</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={mockData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#7c3aed"
            name="Sleep Hours"
            strokeWidth={3}
            dot={{ fill: "#a78bfa", r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="quality"
            stroke="#10b981"
            name="Quality %"
            strokeWidth={3}
            dot={{ fill: "#6ee7b7", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
