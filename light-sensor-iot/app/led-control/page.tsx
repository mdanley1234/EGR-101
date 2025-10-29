import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Lightbulb, Power } from "lucide-react"
import Link from "next/link"
import { PowerToggle } from "@/components/power-toggle"
import { LedControlWrapper } from "@/components/led-control-wrapper"

export default async function LedControlPage() {
  const supabase = await createClient()

  // Fetch current LED status
  const { data: currentStatus } = await supabase
    .from("led_chamber_controls")
    .select("*")
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
          <h1 className="text-3xl font-bold text-foreground">LED Chamber Control</h1>
          <p className="text-muted-foreground">Manage LED lighting system settings</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Current Status */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Current Status</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Power Control</CardTitle>
                <Power className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <PowerToggle currentStatus={currentStatus?.led_status || false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Power Status</CardTitle>
                <Power className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${currentStatus?.led_status ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                  />
                  <span className="text-2xl font-bold">{currentStatus?.led_status ? "ON" : "OFF"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentStatus ? new Date(currentStatus.timestamp).toLocaleString() : "No data"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Brightness Level</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStatus?.brightness_level || 0}%</div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${currentStatus?.brightness_level || 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Color Temperature</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentStatus?.color_temperature || 0}K</div>
                <p className="text-xs text-muted-foreground">
                  {currentStatus?.color_temperature
                    ? currentStatus.color_temperature < 3500
                      ? "Warm white"
                      : currentStatus.color_temperature < 5000
                        ? "Neutral white"
                        : "Cool white"
                    : "Not set"}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Control Panel */}
        <LedControlWrapper currentStatus={currentStatus} />
      </main>
    </div>
  )
}
