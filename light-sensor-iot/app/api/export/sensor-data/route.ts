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

    // Convert to CSV
    const headers = [
      "ID",
      "Timestamp",
      "Light Intensity (lux)",
      "Expected Intensity (lux)",
      "Deviation (%)",
      "GPS Latitude",
      "GPS Longitude",
      "Weather Condition",
      "Temperature (°C)",
      "Cloud Cover (%)",
    ]

    const csvRows = [headers.join(",")]

    readings?.forEach((reading) => {
      const row = [
        reading.id,
        reading.timestamp,
        reading.light_intensity,
        reading.expected_intensity || "N/A",
        reading.deviation_percentage || "N/A",
        reading.gps_latitude || "N/A",
        reading.gps_longitude || "N/A",
        reading.weather_condition || "N/A",
        reading.temperature || "N/A",
        reading.cloud_cover || "N/A",
      ]
      csvRows.push(row.join(","))
    })

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="sensor_data_${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
