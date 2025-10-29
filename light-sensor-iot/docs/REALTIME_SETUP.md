# Real-Time Communication Setup

This guide explains how to set up real-time bidirectional communication between your Raspberry Pi and the web application.

## Architecture Overview

\`\`\`
Raspberry Pi ←→ Web App ←→ Supabase Database
     ↓              ↓              ↓
  Sensors      Real-time UI    Data Storage
  LED Control  Supabase Realtime
\`\`\`

## How It Works

### 1. **Pi → Web App (Continuous)**
- Raspberry Pi reads sensor data every 5 seconds
- Sends data via POST to `/api/sensor`
- Data is stored in Supabase database
- Supabase Realtime broadcasts changes to all connected clients
- Web UI updates instantly without page refresh

### 2. **Web App → Pi (On Manual Control)**
- User adjusts LED settings in Manual mode
- Settings are saved to database
- Pi polls `/api/led/status` every 2 seconds
- Pi detects changes and applies new settings to hardware

## Setup Instructions

### Step 1: Deploy Your Web App

1. Click the **"Publish"** button in v0
2. Your app will deploy to Vercel
3. Copy your deployment URL (e.g., `https://your-app.vercel.app`)

### Step 2: Enable Supabase Realtime

Supabase Realtime is already configured in your app. The database tables automatically broadcast changes to subscribed clients.

### Step 3: Configure Raspberry Pi

1. **Install Python dependencies:**
   \`\`\`bash
   pip install requests
   \`\`\`

2. **Copy the script to your Pi:**
   - Download `scripts/raspberry_pi_realtime.py`
   - Transfer to your Raspberry Pi

3. **Update the BASE_URL:**
   \`\`\`python
   BASE_URL = "https://your-app.vercel.app"  # Replace with your actual URL
   \`\`\`

4. **Add your sensor reading code:**
   Replace the simulated sensor reading in `read_sensor_data()` with actual hardware code.

5. **Add your LED control code:**
   Replace the placeholder in `apply_led_settings()` with actual LED control code.

### Step 4: Run the Pi Script

**Manual start:**
\`\`\`bash
python3 raspberry_pi_realtime.py
\`\`\`

**Auto-start on boot (systemd service):**
\`\`\`bash
sudo nano /etc/systemd/system/iot-controller.service
\`\`\`

Add:
\`\`\`ini
[Unit]
Description=IoT Light Sensor Controller
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/raspberry_pi_realtime.py
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
sudo systemctl enable iot-controller.service
sudo systemctl start iot-controller.service
sudo systemctl status iot-controller.service
\`\`\`

## Real-Time Features

### Web App Features

1. **Live Sensor Display**
   - Homepage shows real-time sensor readings
   - Updates instantly when Pi sends new data
   - Green "Live" indicator shows connection status

2. **Manual LED Control**
   - Adjust brightness and color temperature
   - Changes are immediately available to Pi
   - Control history tracks all adjustments

3. **Auto LED Control**
   - Choose data source: Sensor, GPS, or Combined
   - Pi automatically adjusts LEDs based on selected mode

### Raspberry Pi Features

1. **Continuous Sensor Monitoring**
   - Reads sensor every 5 seconds
   - Sends data to web app automatically
   - All readings stored in database

2. **LED Control Response**
   - Checks for manual control changes every 2 seconds
   - Applies new settings immediately
   - Only updates when settings change

## Troubleshooting

### Pi Can't Connect to Web App

1. Check your BASE_URL is correct
2. Verify internet connection on Pi
3. Check firewall settings
4. Test API endpoint manually:
   \`\`\`bash
   curl https://your-app.vercel.app/api/led/status
   \`\`\`

### Real-Time Updates Not Working

1. Check browser console for errors
2. Verify Supabase connection in web app
3. Check if data is being stored in database
4. Refresh the page to reconnect

### LED Settings Not Applying

1. Verify Pi is polling `/api/led/status`
2. Check LED control code is implemented
3. Verify manual mode is selected
4. Check Pi logs for errors

## API Endpoints

### POST /api/sensor
Send sensor reading from Pi to web app.

**Request:**
\`\`\`json
{
  "actual_intensity": 850.5,
  "expected_intensity": 1000.0,
  "temperature": 22.5,
  "humidity": 45.0,
  "latitude": 37.7749,
  "longitude": -122.4194
}
\`\`\`

### GET /api/led/status
Get current LED control settings.

**Response:**
\`\`\`json
{
  "success": true,
  "status": {
    "led_status": true,
    "brightness_level": 75,
    "color_temperature": 5000,
    "control_mode": "manual",
    "data_source": null
  }
}
\`\`\`

## Performance Notes

- **Sensor interval:** 5 seconds provides good real-time feel without overwhelming the database
- **LED check interval:** 2 seconds ensures responsive control without excessive polling
- **Database storage:** All sensor readings are permanently stored for historical analysis
- **Supabase Realtime:** Broadcasts changes to all connected clients with minimal latency

## Next Steps

1. Customize sensor reading intervals based on your needs
2. Implement auto-mode LED adjustment logic
3. Add error handling and retry logic
4. Set up monitoring and alerts
5. Configure CCTV footage upload (see `raspberry_pi_example.py`)
