import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Database, Download, Calendar } from "lucide-react"
import Link from "next/link"

export default async function DataStoragePage() {
  const supabase = await createClient()

  // Fetch data counts
  const { count: sensorCount } = await supabase.from("sensor_readings").select("*", { count: "exact", head: true })

  const { count: ledCount } = await supabase.from("led_chamber_controls").select("*", { count: "exact", head: true })

  const { count: cctvCount } = await supabase.from("cctv_footage").select("*", { count: "exact", head: true })

  const { count: alertCount } = await supabase.from("alerts").select("*", { count: "exact", head: true })

  // Fetch oldest and newest records
  const { data: oldestReading } = await supabase
    .from("sensor_readings")
    .select("timestamp")
    .order("timestamp", { ascending: true })
    .limit(1)
    .single()

  const { data: newestReading } = await supabase
    .from("sensor_readings")
    .select("timestamp")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Data Storage</h1>
          <p className="text-muted-foreground">System data overview and export options</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Storage Statistics */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Storage Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sensor Readings</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sensorCount || 0}</div>
                <p className="text-xs text-muted-foreground">Total records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LED Controls</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ledCount || 0}</div>
                <p className="text-xs text-muted-foreground">Total records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CCTV Footage</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cctvCount || 0}</div>
                <p className="text-xs text-muted-foreground">Total records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alertCount || 0}</div>
                <p className="text-xs text-muted-foreground">Total records</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Range */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Data Range</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Collection Period
              </CardTitle>
              <CardDescription>Time span of stored data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Oldest Record</p>
                  <p className="text-lg font-semibold">
                    {oldestReading ? new Date(oldestReading.timestamp).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {oldestReading ? new Date(oldestReading.timestamp).toLocaleTimeString() : ""}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Newest Record</p>
                  <p className="text-lg font-semibold">
                    {newestReading ? new Date(newestReading.timestamp).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {newestReading ? new Date(newestReading.timestamp).toLocaleTimeString() : ""}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Export Options */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Data Export</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Export Sensor Data</CardTitle>
                <CardDescription>Download all sensor readings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Export all light intensity sensor readings with timestamps and deviations.
                </p>
                <Link
                  href="/api/export/sensor-data"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export GPS & Environmental Data</CardTitle>
                <CardDescription>Download location and weather data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Export GPS coordinates, sun angles, weather conditions, and comparison to sensor readings.
                </p>
                <Link
                  href="/api/export/gps-data"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export LED Control History</CardTitle>
                <CardDescription>Download LED chamber control logs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Export complete history of LED settings including mode changes and data sources.
                </p>
                <Link
                  href="/api/export/led-history"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export CCTV Metadata</CardTitle>
                <CardDescription>Download footage information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Export metadata for all CCTV recordings including timestamps and file information.
                </p>
                <Link
                  href="/api/export/cctv-metadata"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Alerts</CardTitle>
                <CardDescription>Download system alerts log</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Export all system alerts including severity levels and timestamps.
                </p>
                <Link
                  href="/api/export/alerts"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
