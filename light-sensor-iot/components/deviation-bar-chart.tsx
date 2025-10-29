"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface DeviationBarChartProps {
  data: Array<{
    time: string
    actual: number
    expected: number
    deviation: number
  }>
}

export function DeviationBarChart({ data }: DeviationBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deviation Analysis</CardTitle>
        <CardDescription>Difference between actual and expected values</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" label={{ value: "Deviation (Lux)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="deviation" fill="hsl(var(--chart-3))" name="Deviation" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
