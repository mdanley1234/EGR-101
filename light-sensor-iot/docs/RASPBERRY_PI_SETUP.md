# Raspberry Pi Integration Guide

## Overview
This guide explains how to send data from your Raspberry Pi to the web application.

## API Endpoints

### 1. Send Sensor Readings
**Endpoint:** `POST /api/sensor`

**Request Body:**
\`\`\`json
{
  "actual_intensity": 850.5,
  "expected_intensity": 900.0,
  "temperature": 22.5,
  "humidity": 45.0,
  "latitude": 37.7749,
  "longitude": -122.4194
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "reading": { ... }
}
\`\`\`

### 2. Get LED Control Status
**Endpoint:** `GET /api/led/status`

**Response:**
\`\`\`json
{
  "success": true,
  "status": {
    "led_status": true,
    "brightness": 80,
    "color_temperature": 5000,
    "control_mode": "auto",
    "data_source": "sensor_gps"
  }
}
\`\`\`

### 3. Upload CCTV Footage Metadata
**Endpoint:** `POST /api/cctv/upload`

**Request Body:**
\`\`\`json
{
  "file_name": "footage_2025-01-29_14-30.mp4",
  "file_url": "https://your-storage.com/video.mp4",
  "file_size": 15728640,
  "duration": 120,
  "notes": "Captured during high intensity period"
}
\`\`\`

## Setup Instructions

### 1. Install Dependencies on Raspberry Pi
\`\`\`bash
pip install requests
\`\`\`

### 2. Configure Your Script
- Replace `BASE_URL` with your deployed Vercel app URL
- Add your actual sensor reading code
- Add your LED control hardware code

### 3. Run the Script
\`\`\`bash
python raspberry_pi_example.py
\`\`\`

### 4. Set Up as Service (Optional)
To run automatically on boot:

\`\`\`bash
sudo nano /etc/systemd/system/iot-sensor.service
\`\`\`

Add:
\`\`\`ini
[Unit]
Description=IoT Sensor Data Sender
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/raspberry_pi_example.py
WorkingDirectory=/home/pi
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
\`\`\`

Enable and start:
\`\`\`bash
sudo systemctl enable iot-sensor.service
sudo systemctl start iot-sensor.service
\`\`\`

## Testing

Test the API endpoints using curl:

\`\`\`bash
# Test sensor reading
curl -X POST https://your-app.vercel.app/api/sensor \
  -H "Content-Type: application/json" \
  -d '{"actual_intensity": 850.5, "temperature": 22.5}'

# Test LED status
curl https://your-app.vercel.app/api/led/status
\`\`\`

## Troubleshooting

- **Connection errors:** Check your internet connection and BASE_URL
- **Authentication errors:** Ensure your Supabase integration is properly configured
- **Data not appearing:** Check the database tables were created (run SQL scripts)
