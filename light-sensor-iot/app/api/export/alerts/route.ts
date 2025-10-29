import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: alerts, error } = await supabase.from("alerts").select("*").order("timestamp", { ascending: false })

    if (error) throw error

    const headers = ["ID", "Timestamp", "Alert Type", "Severity", "Message", "Is Resolved"]

    const csvRows = [headers.join(",")]

    alerts?.forEach((alert) => {
      const row = [
        alert.id,
        alert.timestamp,
        alert.alert_type,
        alert.severity,
        `"${alert.message}"`, // Wrap in quotes for CSV
        alert.is_resolved ? "Yes" : "No",
      ]
      csvRows.push(row.join(","))
    })

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="alerts_${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
