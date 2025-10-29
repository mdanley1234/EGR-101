import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: footage, error } = await supabase
      .from("cctv_footage")
      .select("*")
      .order("timestamp", { ascending: false })

    if (error) throw error

    const headers = ["ID", "Timestamp", "Duration (seconds)", "File Size (MB)", "File Path", "Notes"]

    const csvRows = [headers.join(",")]

    footage?.forEach((item) => {
      const row = [
        item.id,
        item.timestamp,
        item.duration_seconds,
        item.file_size_mb,
        item.file_path,
        `"${item.notes || ""}"`,
      ]
      csvRows.push(row.join(","))
    })

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="cctv_metadata_${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
