import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET endpoint for Raspberry Pi to check current LED settings
export async function GET() {
  try {
    const supabase = await createClient()

    // Get the most recent LED control setting
    const { data: status, error } = await supabase
      .from("led_chamber_controls")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to fetch LED status" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      status: status || {
        led_status: false,
        brightness: 0,
        color_temperature: 5000,
        control_mode: "manual",
        data_source: null,
      },
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
