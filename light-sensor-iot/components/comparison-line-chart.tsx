"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ComparisonLineChartProps {
  data: Array<{
    time: string
    actual: number
    expected: number
    deviation: number
  }>
}

export function ComparisonLineChart({ data }: ComparisonLineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actual vs Expected Light Intensity</CardTitle>
        <CardDescription>Real-time comparison of sensor readings and predictions</CardDescription>
      </CardHeader>
      <CardContent>
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
                dataKey="actual"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Actual Reading"
              />
              <Line
                type="monotone"
                dataKey="expected"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Expected Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
