"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { LedControl } from "@/types/database"
import { Hand, BotIcon, BookOpen, Cloud } from "lucide-react"

interface LedControlFormProps {
  currentStatus: LedControl | null
  onSuccess?: () => void
}

export function LedControlForm({ currentStatus, onSuccess }: LedControlFormProps) {
  const [controlMode, setControlMode] = useState<"manual" | "auto">(currentStatus?.control_mode || "manual")
  const [dataSource, setDataSource] = useState<"sensor_only" | "sensor_gps" | "gps_only">(
    currentStatus?.data_source || "sensor_only",
  )
  const [brightness, setBrightness] = useState(currentStatus?.brightness_level || 50)
  const [colorTemp, setColorTemp] = useState(currentStatus?.color_temperature || 5000)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("led_chamber_controls").insert({
        led_status: true,
        brightness_level: brightness,
        color_temperature: colorTemp,
        control_mode: controlMode,
        data_source: controlMode === "auto" ? dataSource : null,
        duration_minutes: null,
        timestamp: new Date().toISOString(),
      })

      if (error) throw error

      setMessage({ type: "success", text: "LED settings updated successfully!" })
      router.refresh()
      onSuccess?.()
    } catch (error) {
      console.error("[v0] Error updating LED settings:", error)
      setMessage({ type: "error", text: "Failed to update LED settings. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-semibold">Control Mode</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setControlMode("manual")}
            className={`p-4 rounded-lg border-2 transition-all ${
              controlMode === "manual"
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card hover:bg-accent"
            }`}
          >
            <div className="text-center">
              <Hand className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-semibold">Manual</div>
              <div className="text-xs text-muted-foreground mt-1">Direct control</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setControlMode("auto")}
            className={`p-4 rounded-lg border-2 transition-all ${
              controlMode === "auto"
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card hover:bg-accent"
            }`}
          >
            <div className="text-center">
              <BotIcon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-lg font-semibold">Auto</div>
              <div className="text-xs text-muted-foreground mt-1">Data-driven</div>
            </div>
          </button>
        </div>
      </div>

      {controlMode === "auto" && (
        <div className="space-y-3 p-4 rounded-lg border bg-card">
          <Label className="text-base font-semibold">Light Intensity Input Data</Label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setDataSource("sensor_only")}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                dataSource === "sensor_only"
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Sensor Reading Only</div>
                  <div className="text-xs text-muted-foreground mt-1">Use light sensor data exclusively</div>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setDataSource("sensor_gps")}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                dataSource === "sensor_gps"
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-xs">+</span>
                  <Cloud className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Sensor + GPS Reading</div>
                  <div className="text-xs text-muted-foreground mt-1">Combine sensor and GPS control data</div>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setDataSource("gps_only")}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                dataSource === "gps_only"
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Cloud className="h-5 w-5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">GPS Reading Only</div>
                  <div className="text-xs text-muted-foreground mt-1">Use GPS-based calculations exclusively</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {controlMode === "manual" && (
        <>
          {/* Brightness Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightness" className="text-base font-semibold">
                Brightness Level
              </Label>
              <span className="text-sm font-mono font-semibold">{brightness}%</span>
            </div>
            <Slider
              id="brightness"
              min={0}
              max={100}
              step={1}
              value={[brightness]}
              onValueChange={(value) => setBrightness(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Adjust the LED brightness from 0% to 100%</p>
          </div>

          {/* Color Temperature Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="color-temp" className="text-base font-semibold">
                Color Temperature
              </Label>
              <span className="text-sm font-mono font-semibold">{colorTemp}K</span>
            </div>
            <Slider
              id="color-temp"
              min={2700}
              max={6500}
              step={100}
              value={[colorTemp]}
              onValueChange={(value) => setColorTemp(value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Warm (2700K)</span>
              <span>Neutral (4500K)</span>
              <span>Cool (6500K)</span>
            </div>
          </div>
        </>
      )}

      {/* Message Display */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Applying Settings..." : "Apply Settings"}
      </Button>
    </form>
  )
}
