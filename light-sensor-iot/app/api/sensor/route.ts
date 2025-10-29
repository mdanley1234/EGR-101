import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { checkSensorDeviation } from "@/lib/alert-generator"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Parse the incoming data from Raspberry Pi
    const data = await request.json()

    // Validate required fields
    if (typeof data.light_intensity !== "number") {
      return NextResponse.json({ error: "Missing or invalid light_intensity" }, { status: 400 })
    }

    let deviationPercentage = null
    if (data.expected_intensity) {
      deviationPercentage = ((data.light_intensity - data.expected_intensity) / data.expected_intensity) * 100
    }

    // Insert sensor reading into database
    const { data: reading, error } = await supabase
      .from("sensor_readings")
      .insert({
        light_intensity: data.light_intensity,
        expected_intensity: data.expected_intensity || null,
        deviation_percentage: deviationPercentage,
        gps_latitude: data.gps_latitude || null,
        gps_longitude: data.gps_longitude || null,
        sun_angle: data.sun_angle || null,
        weather_condition: data.weather_condition || null,
        temperature: data.temperature || null,
        cloud_cover: data.cloud_cover || null,
        humidity: data.humidity || null,
        wind_speed: data.wind_speed || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to store sensor reading" }, { status: 500 })
    }

    if (data.expected_intensity) {
      await checkSensorDeviation(data.light_intensity, data.expected_intensity)
    }

    return NextResponse.json({
      success: true,
      reading,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
