export interface SensorReading {
  id: string
  timestamp: string
  light_intensity: number
  latitude: number | null
  longitude: number | null
  weather_condition: string | null
  expected_intensity: number | null
  deviation: number | null
  created_at: string
}

export interface LedControl {
  id: string
  timestamp: string
  led_status: boolean
  brightness_level: number | null
  color_temperature: number | null
  duration_minutes: number | null
  control_mode: "manual" | "auto"
  data_source: "sensor_only" | "sensor_gps" | "gps_only" | null
  created_at: string
}

export interface CctvFootage {
  id: string
  timestamp: string
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  file_size_mb: number | null
  notes: string | null
  created_at: string
}

export interface Alert {
  id: string
  timestamp: string
  alert_type: string
  severity: "low" | "medium" | "high" | "critical"
  message: string
  is_resolved: boolean
  resolved_at: string | null
  created_at: string
}
