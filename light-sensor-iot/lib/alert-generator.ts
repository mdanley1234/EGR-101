import { createClient } from "@/lib/supabase/server"

export type AlertSeverity = "low" | "medium" | "high" | "critical"

interface AlertConfig {
  type: string
  severity: AlertSeverity
  message: string
}

export async function generateAlert(config: AlertConfig) {
  const supabase = await createClient()

  // Check if similar unresolved alert exists (avoid duplicates)
  const { data: existingAlert } = await supabase
    .from("alerts")
    .select("*")
    .eq("alert_type", config.type)
    .eq("is_resolved", false)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  // If alert exists and was created less than 5 minutes ago, don't create duplicate
  if (existingAlert) {
    const alertAge = Date.now() - new Date(existingAlert.timestamp).getTime()
    if (alertAge < 5 * 60 * 1000) {
      return existingAlert
    }
  }

  // Create new alert
  const { data: newAlert, error } = await supabase
    .from("alerts")
    .insert({
      alert_type: config.type,
      severity: config.severity,
      message: config.message,
      is_resolved: false,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Failed to create alert:", error)
    return null
  }

  return newAlert
}

export async function checkSensorDeviation(actualIntensity: number, expectedIntensity: number | null) {
  if (!expectedIntensity) return

  const deviation = Math.abs(((actualIntensity - expectedIntensity) / expectedIntensity) * 100)

  if (deviation > 50) {
    await generateAlert({
      type: "sensor_deviation",
      severity: "critical",
      message: `Critical sensor deviation detected: ${deviation.toFixed(1)}% difference from expected value`,
    })
  } else if (deviation > 30) {
    await generateAlert({
      type: "sensor_deviation",
      severity: "high",
      message: `High sensor deviation: ${deviation.toFixed(1)}% difference from expected value`,
    })
  } else if (deviation > 15) {
    await generateAlert({
      type: "sensor_deviation",
      severity: "medium",
      message: `Moderate sensor deviation: ${deviation.toFixed(1)}% difference from expected value`,
    })
  }
}

export async function checkSystemStatus(lastReadingTime: Date) {
  const timeSinceLastReading = Date.now() - lastReadingTime.getTime()

  // If no reading for 2 minutes, generate alert
  if (timeSinceLastReading > 2 * 60 * 1000) {
    await generateAlert({
      type: "system_status",
      severity: "high",
      message: "Raspberry Pi connection lost - no sensor data received for 2+ minutes",
    })
  }
}
