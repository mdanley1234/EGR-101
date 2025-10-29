import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { ComparisonLineChart } from "@/components/comparison-line-chart"
import { DeviationBarChart } from "@/components/deviation-bar-chart"

export default async function ComparisonPage() {
  const supabase = await createClient()

  // Fetch recent sensor readings with expected values
  const { data: readings } = await supabase
    .from("sensor_readings")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(20)

  // Prepare comparison data
  const comparisonData =
    readings
      ?.slice()
      .reverse()
      .map((reading) => ({
        time: new Date(reading.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actual: reading.light_intensity,
        expected: reading.expected_intensity || 0,
        deviation: reading.deviation || 0,
      })) || []

  // Calculate statistics
  const stats = readings?.reduce(
    (acc, reading) => {
      const deviation = Math.abs(reading.deviation || 0)
      acc.totalDeviation += deviation
      acc.count++
      if (deviation > acc.maxDeviation) {
        acc.maxDeviation = deviation
      }
      if (reading.light_intensity > (reading.expected_intensity || 0)) {
        acc.overCount++
      } else if (reading.light_intensity < (reading.expected_intensity || 0)) {
        acc.underCount++
      }
      return acc
    },
    { totalDeviation: 0, count: 0, maxDeviation: 0, overCount: 0, underCount: 0 },
  )

  const avgDeviation = stats ? (stats.totalDeviation / stats.count).toFixed(2) : "0"
  const accuracy = stats ? (100 - stats.totalDeviation / stats.count / 10).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Comparison Analysis</h1>
          <p className="text-muted-foreground">Sensor readings vs expected light intensity</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Performance Metrics</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Deviation</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgDeviation} lux</div>
                <p className="text-xs text-muted-foreground">Mean absolute difference</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracy}%</div>
                <p className="text-xs text-muted-foreground">Model performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Over Expected</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.overCount || 0}</div>
                <p className="text-xs text-muted-foreground">Readings above expected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Under Expected</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.underCount || 0}</div>
                <p className="text-xs text-muted-foreground">Readings below expected</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comparison Chart */}
        <section className="mb-8">
          <ComparisonLineChart data={comparisonData} />
        </section>

        {/* Deviation Chart */}
        <section className="mb-8">
          <DeviationBarChart data={comparisonData} />
        </section>

        {/* Detailed Comparison Table */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
              <CardDescription>Side-by-side analysis of readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Timestamp</th>
                      <th className="text-right p-2 font-medium">Actual (lux)</th>
                      <th className="text-right p-2 font-medium">Expected (lux)</th>
                      <th className="text-right p-2 font-medium">Deviation</th>
                      <th className="text-right p-2 font-medium">% Difference</th>
                      <th className="text-center p-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings?.map((reading) => {
                      const percentDiff = reading.expected_intensity
                        ? (
                            ((reading.light_intensity - reading.expected_intensity) / reading.expected_intensity) *
                            100
                          ).toFixed(1)
                        : "N/A"
                      const isSignificant = Math.abs(reading.deviation || 0) > 50

                      return (
                        <tr key={reading.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{new Date(reading.timestamp).toLocaleString()}</td>
                          <td className="p-2 text-right font-mono">{reading.light_intensity.toFixed(2)}</td>
                          <td className="p-2 text-right font-mono">
                            {reading.expected_intensity?.toFixed(2) || "N/A"}
                          </td>
                          <td
                            className={`p-2 text-right font-mono ${isSignificant ? "text-destructive font-semibold" : ""}`}
                          >
                            {reading.deviation?.toFixed(2) || "N/A"}
                          </td>
                          <td
                            className={`p-2 text-right font-mono ${isSignificant ? "text-destructive font-semibold" : ""}`}
                          >
                            {percentDiff !== "N/A" ? `${percentDiff}%` : "N/A"}
                          </td>
                          <td className="p-2 text-center">
                            {isSignificant ? (
                              <span className="inline-flex items-center gap-1 text-destructive text-xs font-semibold">
                                <AlertTriangle className="h-3 w-3" />
                                High
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Normal</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
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
