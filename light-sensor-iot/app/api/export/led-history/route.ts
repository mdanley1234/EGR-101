import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: controls, error } = await supabase
      .from("led_chamber_controls")
      .select("*")
      .order("timestamp", { ascending: false })

    if (error) throw error

    const headers = [
      "ID",
      "Timestamp",
      "LED Status",
      "Brightness Level (%)",
      "Color Temperature (K)",
      "Control Mode",
      "Data Source",
    ]

    const csvRows = [headers.join(",")]

    controls?.forEach((control) => {
      const row = [
        control.id,
        control.timestamp,
        control.led_status ? "ON" : "OFF",
        control.brightness_level,
        control.color_temperature,
        control.control_mode || "manual",
        control.data_source || "N/A",
      ]
      csvRows.push(row.join(","))
    })

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="led_history_${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
