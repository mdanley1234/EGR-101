"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface SensorReadingsChartProps {
  data: Array<{
    time: string
    intensity: number
    expected: number
  }>
}

export function SensorReadingsChart({ data }: SensorReadingsChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="time" className="text-xs" />
          <YAxis className="text-xs" label={{ value: "Lux", angle: -90, position: "insideLeft" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="intensity"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            name="Actual Intensity"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="expected"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Expected Intensity"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
