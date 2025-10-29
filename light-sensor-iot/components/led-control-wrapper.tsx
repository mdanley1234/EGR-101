"use client"

import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"
import { LedControlForm } from "@/components/led-control-form"
import { LedControlHistory } from "@/components/led-control-history"
import type { LedControl } from "@/types/database"

interface LedControlWrapperProps {
  currentStatus: LedControl | null
}

export function LedControlWrapper({ currentStatus }: LedControlWrapperProps) {
  const historyRef = useRef<{ refresh: () => void }>(null)

  const handleFormSuccess = () => {
    if (historyRef.current) {
      historyRef.current.refresh()
    }
  }

  return (
    <>
      {/* Control Panel */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Control Panel</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              LED Settings
            </CardTitle>
            <CardDescription>Configure LED chamber operation mode and parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <LedControlForm currentStatus={currentStatus} onSuccess={handleFormSuccess} />
          </CardContent>
        </Card>
      </section>

      {/* Control History */}
      <LedControlHistory ref={historyRef} />
    </>
  )
}
