import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Activity } from "lucide-react"
import Link from "next/link"
import { SensorReadingsChart } from "@/components/sensor-readings-chart"

export default async function SensorReadingsPage() {
  const supabase = await createClient()

  // Fetch recent sensor readings
  const { data: readings } = await supabase
    .from("sensor_readings")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(50)

  // Prepare chart data (reverse for chronological order)
  const chartData =
    readings
      ?.slice()
      .reverse()
      .map((reading) => ({
        time: new Date(reading.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        intensity: reading.light_intensity,
        expected: reading.expected_intensity || 0,
      })) || []

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Sensor Readings</h1>
          <p className="text-muted-foreground">Real-time light intensity measurements</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Chart Section */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Light Intensity Over Time</CardTitle>
              <CardDescription>Real-time sensor data visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <SensorReadingsChart data={chartData} />
            </CardContent>
          </Card>
        </section>

        {/* Statistics Cards */}
        <section className="mb-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Reading</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{readings?.[0]?.light_intensity.toFixed(2) || "N/A"} lux</div>
                <p className="text-xs text-muted-foreground">
                  {readings?.[0] ? new Date(readings[0].timestamp).toLocaleString() : "No data"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Intensity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {readings?.length
                    ? (readings.reduce((sum, r) => sum + r.light_intensity, 0) / readings.length).toFixed(2)
                    : "N/A"}{" "}
                  lux
                </div>
                <p className="text-xs text-muted-foreground">Based on {readings?.length || 0} readings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Intensity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {readings?.length ? Math.max(...readings.map((r) => r.light_intensity)).toFixed(2) : "N/A"} lux
                </div>
                <p className="text-xs text-muted-foreground">Maximum recorded value</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Table */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
              <CardDescription>Detailed sensor data log</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Timestamp</th>
                      <th className="text-right p-2 font-medium">Intensity (lux)</th>
                      <th className="text-right p-2 font-medium">Expected (lux)</th>
                      <th className="text-right p-2 font-medium">Deviation</th>
                      <th className="text-left p-2 font-medium">Weather</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings?.map((reading) => (
                      <tr key={reading.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{new Date(reading.timestamp).toLocaleString()}</td>
                        <td className="p-2 text-right font-mono">{reading.light_intensity.toFixed(2)}</td>
                        <td className="p-2 text-right font-mono">{reading.expected_intensity?.toFixed(2) || "N/A"}</td>
                        <td
                          className={`p-2 text-right font-mono ${
                            reading.deviation && Math.abs(reading.deviation) > 50
                              ? "text-destructive font-semibold"
                              : ""
                          }`}
                        >
                          {reading.deviation?.toFixed(2) || "N/A"}
                        </td>
                        <td className="p-2">{reading.weather_condition || "Unknown"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
