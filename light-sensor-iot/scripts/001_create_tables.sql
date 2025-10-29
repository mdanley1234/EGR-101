-- Create sensor_readings table to store light intensity data
CREATE TABLE IF NOT EXISTS sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  light_intensity DECIMAL(10, 2) NOT NULL,
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  weather_condition TEXT,
  expected_intensity DECIMAL(10, 2),
  deviation DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create led_chamber_controls table for LED control settings
CREATE TABLE IF NOT EXISTS led_chamber_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  led_status BOOLEAN NOT NULL DEFAULT false,
  brightness_level INTEGER CHECK (brightness_level >= 0 AND brightness_level <= 100),
  color_temperature INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cctv_footage table for storing video metadata
CREATE TABLE IF NOT EXISTS cctv_footage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  file_size_mb DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alerts table for system notifications
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  alert_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_led_controls_timestamp ON led_chamber_controls(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_cctv_footage_timestamp ON cctv_footage(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_unresolved ON alerts(is_resolved) WHERE is_resolved = false;

-- Insert sample data for testing
INSERT INTO sensor_readings (light_intensity, latitude, longitude, weather_condition, expected_intensity, deviation)
VALUES 
  (850.5, 1.3521, 103.8198, 'Clear', 900.0, -49.5),
  (920.3, 1.3521, 103.8198, 'Partly Cloudy', 900.0, 20.3),
  (650.8, 1.3521, 103.8198, 'Cloudy', 700.0, -49.2),
  (980.2, 1.3521, 103.8198, 'Clear', 950.0, 30.2);

INSERT INTO led_chamber_controls (led_status, brightness_level, color_temperature, duration_minutes)
VALUES 
  (true, 75, 5000, 120),
  (false, 0, 0, 0);

INSERT INTO alerts (alert_type, severity, message)
VALUES 
  ('sensor_deviation', 'high', 'Light intensity deviation exceeds 10% threshold'),
  ('system_status', 'low', 'System operating normally'),
  ('maintenance', 'medium', 'Scheduled maintenance due in 7 days');
