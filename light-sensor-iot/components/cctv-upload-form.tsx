"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function CctvUploadForm() {
  const [videoUrl, setVideoUrl] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [duration, setDuration] = useState("")
  const [fileSize, setFileSize] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("cctv_footage").insert({
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        duration_seconds: duration ? Number.parseInt(duration) : null,
        file_size_mb: fileSize ? Number.parseFloat(fileSize) : null,
        notes: notes || null,
        timestamp: new Date().toISOString(),
      })

      if (error) throw error

      setMessage({ type: "success", text: "Footage uploaded successfully!" })
      // Reset form
      setVideoUrl("")
      setThumbnailUrl("")
      setDuration("")
      setFileSize("")
      setNotes("")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error uploading footage:", error)
      setMessage({ type: "error", text: "Failed to upload footage. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="video-url">
          Video URL <span className="text-destructive">*</span>
        </Label>
        <Input
          id="video-url"
          type="url"
          placeholder="https://example.com/video.mp4"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail-url">Thumbnail URL (optional)</Label>
        <Input
          id="thumbnail-url"
          type="url"
          placeholder="https://example.com/thumbnail.jpg"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            placeholder="120"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-size">File Size (MB)</Label>
          <Input
            id="file-size"
            type="number"
            step="0.01"
            min="0"
            placeholder="25.5"
            value={fileSize}
            onChange={(e) => setFileSize(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any relevant notes about this footage..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Upload Footage"}
      </Button>
    </form>
  )
}
