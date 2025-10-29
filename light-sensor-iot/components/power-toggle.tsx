"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface PowerToggleProps {
  currentStatus: boolean
}

export function PowerToggle({ currentStatus }: PowerToggleProps) {
  const [isPowered, setIsPowered] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true)
    setIsPowered(checked)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("led_chamber_controls").insert({
        led_status: checked,
        brightness_level: null,
        color_temperature: null,
        control_mode: "manual",
        data_source: null,
        duration_minutes: null,
        timestamp: new Date().toISOString(),
      })

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error toggling power:", error)
      setIsPowered(!checked)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="power-toggle" className="text-sm font-medium cursor-pointer">
        {isPowered ? "Turn Off" : "Turn On"}
      </Label>
      <Switch id="power-toggle" checked={isPowered} onCheckedChange={handleToggle} disabled={isUpdating} />
    </div>
  )
}
