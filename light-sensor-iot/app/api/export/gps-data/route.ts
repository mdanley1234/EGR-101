import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: readings, error } = await supabase
      .from("sensor_readings")
      .select("*")
      .order("timestamp", { ascending: false })

    if (error) throw error

    const headers = [
      "Timestamp",
      "GPS Latitude",
      "GPS Longitude",
      "Sun Angle (degrees)",
      "Expected Light Intensity (lux)",
      "Actual Light Intensity (lux)",
      "Deviation (%)",
      "Weather Condition",
      "Temperature (°C)",
      "Cloud Cover (%)",
      "Humidity (%)",
      "Wind Speed (m/s)",
    ]

    const csvRows = [headers.join(",")]

    readings?.forEach((reading) => {
      const row = [
        reading.timestamp,
        reading.gps_latitude || "N/A",
        reading.gps_longitude || "N/A",
        reading.sun_angle || "N/A",
        reading.expected_intensity || "N/A",
        reading.light_intensity,
        reading.deviation_percentage || "N/A",
        reading.weather_condition || "N/A",
        reading.temperature || "N/A",
        reading.cloud_cover || "N/A",
        reading.humidity || "N/A",
        reading.wind_speed || "N/A",
      ]
      csvRows.push(row.join(","))
    })

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="gps_data_${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
