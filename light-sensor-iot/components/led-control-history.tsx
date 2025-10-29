"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { LedControl } from "@/types/database"

export const LedControlHistory = forwardRef<{ refresh: () => void }>(function LedControlHistory(props, ref) {
  const [weekOffset, setWeekOffset] = useState(0) // 0 = current week, -1 = last week, etc.
  const [history, setHistory] = useState<LedControl[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [weekRange, setWeekRange] = useState({ monday: new Date(), sunday: new Date() })

  // Calculate Monday and Sunday of the selected week
  const getWeekRange = (offset: number) => {
    const today = new Date()
    const currentDay = today.getDay()
    const diff = currentDay === 0 ? -6 : 1 - currentDay // Adjust to Monday

    const monday = new Date(today)
    monday.setDate(today.getDate() + diff + offset * 7)
    monday.setHours(0, 0, 0, 0)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    sunday.setHours(23, 59, 59, 999)

    return { monday, sunday }
  }

  // Format week range for display
  const formatWeekRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    const mondayStr = weekRange.monday.toLocaleDateString("en-US", options)
    const sundayStr = weekRange.sunday.toLocaleDateString("en-US", options)
    const year = weekRange.sunday.getFullYear()

    if (weekOffset === 0) {
      return `Current Week (${mondayStr} - ${sundayStr}, ${year})`
    }
    return `Week of ${mondayStr} - ${sundayStr}, ${year}`
  }

  const fetchHistory = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { monday, sunday } = getWeekRange(weekOffset)
    setWeekRange({ monday, sunday })

    const { data } = await supabase
      .from("led_chamber_controls")
      .select("*")
      .gte("timestamp", monday.toISOString())
      .lte("timestamp", sunday.toISOString())
      .order("timestamp", { ascending: false })

    setHistory(data || [])
    setIsLoading(false)
  }

  useImperativeHandle(ref, () => ({
    refresh: fetchHistory,
  }))

  useEffect(() => {
    fetchHistory()
  }, [weekOffset]) // Only depend on weekOffset

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Control History</h2>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {formatWeekRange()}
              </CardTitle>
              <CardDescription>Log of LED control adjustments and mode changes</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setWeekOffset(weekOffset - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWeekOffset(weekOffset + 1)}
                disabled={weekOffset === 0}
              >
                Next Week
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No control history for this week</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Timestamp</th>
                    <th className="text-center p-2 font-medium">Status</th>
                    <th className="text-center p-2 font-medium">Mode</th>
                    <th className="text-center p-2 font-medium">Data Source</th>
                    <th className="text-right p-2 font-medium">Brightness</th>
                    <th className="text-right p-2 font-medium">Temperature</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{new Date(record.timestamp).toLocaleString()}</td>
                      <td className="p-2 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                            record.led_status
                              ? "bg-green-500/20 text-green-700 dark:text-green-400"
                              : "bg-gray-500/20 text-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {record.led_status ? "ON" : "OFF"}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                            record.control_mode === "auto"
                              ? "bg-blue-500/20 text-blue-700 dark:text-blue-400"
                              : "bg-purple-500/20 text-purple-700 dark:text-purple-400"
                          }`}
                        >
                          {record.control_mode === "auto" ? "AUTO" : "MANUAL"}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        {record.control_mode === "auto" && record.data_source ? (
                          <span className="text-xs">
                            {record.data_source === "sensor_only" && "Sensor"}
                            {record.data_source === "sensor_gps" && "Sensor+GPS"}
                            {record.data_source === "gps_only" && "GPS"}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-2 text-right font-mono">{record.brightness_level || 0}%</td>
                      <td className="p-2 text-right font-mono">{record.color_temperature || 0}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
})
