import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Cloud, Sun, Thermometer } from "lucide-react"
import Link from "next/link"

export default async function GpsWeatherPage() {
  const supabase = await createClient()

  // Fetch latest sensor reading with GPS data
  const { data: latestReading } = await supabase
    .from("sensor_readings")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  // Calculate sun angle (simplified calculation)
  const calculateSunAngle = (lat: number, lon: number) => {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const timeDecimal = hour + minute / 60

    // Simplified solar elevation angle calculation
    // This is a rough approximation - real calculation would need date, declination, etc.
    let angle = 0
    if (timeDecimal >= 6 && timeDecimal <= 18) {
      // Daytime hours
      const noonOffset = Math.abs(timeDecimal - 12)
      angle = 90 - noonOffset * 7.5 // Rough approximation
    }

    return Math.max(0, angle).toFixed(1)
  }

  const sunAngle =
    latestReading?.latitude && latestReading?.longitude
      ? calculateSunAngle(latestReading.latitude, latestReading.longitude)
      : "N/A"

  // Mock weather data (in production, this would come from a weather API)
  const weatherData = {
    temperature: 28,
    humidity: 75,
    cloudCover: 40,
    uvIndex: 7,
    visibility: 10,
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">GPS & Weather Data</h1>
          <p className="text-muted-foreground">Location and environmental conditions</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* GPS Location */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">GPS Location</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Current Position
              </CardTitle>
              <CardDescription>Sensor location coordinates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Latitude</p>
                  <p className="text-2xl font-mono font-bold">{latestReading?.latitude?.toFixed(6) || "N/A"}°</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Longitude</p>
                  <p className="text-2xl font-mono font-bold">{latestReading?.longitude?.toFixed(6) || "N/A"}°</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">Location:</span> Singapore (approximate)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {latestReading ? new Date(latestReading.timestamp).toLocaleString() : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Sun Position */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Solar Position</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Sun Angle
                </CardTitle>
                <CardDescription>Current solar elevation angle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">{sunAngle}°</div>
                <p className="text-sm text-muted-foreground">
                  {Number.parseFloat(sunAngle) > 45
                    ? "High sun position"
                    : Number.parseFloat(sunAngle) > 20
                      ? "Medium sun position"
                      : "Low sun position"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Light Intensity</CardTitle>
                <CardDescription>Based on sun angle and weather</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">
                  {latestReading?.expected_intensity?.toFixed(0) || "N/A"} lux
                </div>
                <p className="text-sm text-muted-foreground">Calculated from solar position and cloud cover</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Weather Conditions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Weather Conditions</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Current Weather
              </CardTitle>
              <CardDescription>Environmental factors affecting light intensity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Temperature</p>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Humidity</p>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.humidity}%</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cloud Cover</p>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.cloudCover}%</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">UV Index</p>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.uvIndex}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Visibility</p>
                  </div>
                  <p className="text-2xl font-bold">{weatherData.visibility} km</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold mb-1">
                  Current Condition: {latestReading?.weather_condition || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Weather conditions directly impact expected light intensity calculations
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Impact Analysis */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Impact Analysis</h2>
          <Card>
            <CardHeader>
              <CardTitle>Environmental Factors</CardTitle>
              <CardDescription>How weather affects light intensity readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Sun className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Sun Angle Impact</p>
                    <p className="text-xs text-muted-foreground">
                      Higher sun angles (closer to 90°) result in maximum light intensity. Current angle of {sunAngle}°
                      suggests {Number.parseFloat(sunAngle) > 45 ? "strong" : "moderate"} direct sunlight.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Cloud className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Cloud Cover Effect</p>
                    <p className="text-xs text-muted-foreground">
                      {weatherData.cloudCover}% cloud cover reduces light intensity by approximately{" "}
                      {(weatherData.cloudCover * 0.7).toFixed(0)}%. Clear skies allow maximum light transmission.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Thermometer className="h-5 w-5 mt-0.5 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Atmospheric Conditions</p>
                    <p className="text-xs text-muted-foreground">
                      Temperature and humidity affect atmospheric clarity. Current conditions show{" "}
                      {weatherData.humidity}% humidity, which may cause slight light scattering.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
