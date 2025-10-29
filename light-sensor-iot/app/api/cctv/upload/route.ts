import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const data = await request.json()

    // Validate required fields
    if (!data.file_url || !data.file_name) {
      return NextResponse.json({ error: "Missing required fields: file_url, file_name" }, { status: 400 })
    }

    // Insert CCTV footage record
    const { data: footage, error } = await supabase
      .from("cctv_footage")
      .insert({
        file_name: data.file_name,
        file_url: data.file_url,
        file_size: data.file_size || null,
        duration: data.duration || null,
        notes: data.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to store CCTV footage record" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      footage,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
