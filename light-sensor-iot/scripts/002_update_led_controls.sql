-- Add new columns for auto/manual mode and data source selection
ALTER TABLE led_chamber_controls
ADD COLUMN control_mode TEXT DEFAULT 'manual' CHECK (control_mode IN ('manual', 'auto')),
ADD COLUMN data_source TEXT CHECK (data_source IN ('sensor_only', 'sensor_gps', 'gps_only'));

-- Update existing records to have manual mode
UPDATE led_chamber_controls SET control_mode = 'manual' WHERE control_mode IS NULL;
