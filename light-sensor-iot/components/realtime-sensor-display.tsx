"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, Wifi, WifiOff } from "lucide-react"
import type { SensorReading } from "@/types/database"

export function RealtimeSensorDisplay() {
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null)
  const [avgIntensity, setAvgIntensity] = useState<string>("0")
  const [readingCount, setReadingCount] = useState<number>(0)
  const [isConnected, setIsConnected] = useState(false)
  const [lastReadingTime, setLastReadingTime] = useState<Date | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const fetchInitialData = async () => {
      const { data: latest } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single()

      if (latest) {
        setLatestReading(latest)
        setLastReadingTime(new Date(latest.timestamp))
      }

      const { data: todayReadings } = await supabase
        .from("sensor_readings")
        .select("light_intensity")
        .gte("timestamp", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

      if (todayReadings?.length) {
        const avg = (todayReadings.reduce((sum, r) => sum + r.light_intensity, 0) / todayReadings.length).toFixed(2)
        setAvgIntensity(avg)
        setReadingCount(todayReadings.length)
      }
    }

    fetchInitialData()

    const channel = supabase
      .channel("sensor_readings_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_readings",
        },
        (payload) => {
          setLatestReading(payload.new as SensorReading)
          setIsConnected(true)
          setLastReadingTime(new Date())
          fetchInitialData()
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true)
        }
      })

    const connectionCheck = setInterval(() => {
      if (lastReadingTime) {
        const timeSinceLastReading = Date.now() - lastReadingTime.getTime()
        // Consider disconnected if no reading for 30 seconds
        if (timeSinceLastReading > 30000) {
          setIsConnected(false)
        }
      }
    }, 10000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(connectionCheck)
    }
  }, [lastReadingTime])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Light Intensity</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestReading?.light_intensity.toFixed(2) || "N/A"} lux</div>
          <p className="text-xs text-muted-foreground">
            {latestReading ? new Date(latestReading.timestamp).toLocaleTimeString() : "Waiting for data..."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgIntensity} lux</div>
          <p className="text-xs text-muted-foreground">{readingCount} readings today</p>
        </CardContent>
      </Card>

      <Card className={isConnected ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Raspberry Pi Status</CardTitle>
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${isConnected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </div>
          <p className="text-xs text-muted-foreground">
            {isConnected ? "Receiving real-time data" : "No data received (30s+)"}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <span
              className={`text-xs font-medium ${isConnected ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
