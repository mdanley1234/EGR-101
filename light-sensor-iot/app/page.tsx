import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, DatabaseIcon, BookOpenIcon, Lightbulb, Camera, CloudIcon, Activity } from "lucide-react"
import Link from "next/link"
import { RealtimeSensorDisplay } from "@/components/realtime-sensor-display"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch latest sensor reading
  const { data: latestReading } = await supabase
    .from("sensor_readings")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  // Fetch unresolved alerts
  const { data: unresolvedAlerts } = await supabase
    .from("alerts")
    .select("*")
    .eq("is_resolved", false)
    .order("timestamp", { ascending: false })
    .limit(5)

  // Fetch today's average light intensity
  const { data: todayReadings } = await supabase
    .from("sensor_readings")
    .select("light_intensity")
    .gte("timestamp", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

  const avgIntensity = todayReadings?.length
    ? (todayReadings.reduce((sum, r) => sum + r.light_intensity, 0) / todayReadings.length).toFixed(2)
    : "0"

  // Fetch LED status
  const { data: ledStatus } = await supabase
    .from("led_chamber_controls")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground">Light Intensity Monitoring System</h1>
          <p className="text-muted-foreground">Real-time IoT sensor dashboard</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Executive Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Executive Summary</h2>
          <RealtimeSensorDisplay />
        </section>

        {/* LED Status Card */}
        <section className="mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LED Chamber Status</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ledStatus?.led_status ? "Active" : "Inactive"}</div>
              <p className="text-xs text-muted-foreground">
                {ledStatus?.led_status ? `${ledStatus.brightness_level}% brightness` : "System off"}
              </p>
              {ledStatus?.control_mode && (
                <p className="text-xs text-muted-foreground mt-1">
                  Mode: {ledStatus.control_mode === "manual" ? "Manual Control" : "Auto Control"}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Active Alerts */}
        {unresolvedAlerts && unresolvedAlerts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Active Alerts</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {unresolvedAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                      <AlertCircle className="h-5 w-5 mt-0.5 text-destructive" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">Type: {alert.alert_type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quick Navigation */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">System Modules</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/sensor-readings">
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <BookOpenIcon className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Sensor Readings</CardTitle>
                  <CardDescription>View real-time light intensity measurements</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/gps-weather">
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <CloudIcon className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>GPS & Weather</CardTitle>
                  <CardDescription>Location data and weather conditions</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/comparison">
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <Activity className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Comparison Analysis</CardTitle>
                  <CardDescription>Compare sensor vs expected intensity</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/led-control">
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <Lightbulb className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>LED Control</CardTitle>
                  <CardDescription>Manage LED chamber settings</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/cctv">
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <Camera className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>CCTV Footage</CardTitle>
                  <CardDescription>View and manage camera recordings</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/data-storage">
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <DatabaseIcon className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Data Storage</CardTitle>
                  <CardDescription>Access historical data and exports</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
