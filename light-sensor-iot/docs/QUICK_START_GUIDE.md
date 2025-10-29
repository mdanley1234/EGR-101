# Quick Start Guide: Connecting Your Raspberry Pi

## Overview
This guide will help you connect your Raspberry Pi to the web application to send real-time sensor data.

## What You Need
- Raspberry Pi (any model with WiFi)
- Light intensity sensor connected to your Pi
- Computer with internet access
- Your deployed web app URL

## Important: The Web App Does NOT Run the Script Automatically
You must manually set up and run the Python script on your Raspberry Pi. The web app only receives and displays the data that your Pi sends.

---

## Step-by-Step Setup

### Step 1: Deploy Your Web App
1. Click the **"Publish"** button in v0 (top right)
2. Your app will deploy to Vercel
3. Copy your deployment URL (e.g., `https://your-app.vercel.app`)

### Step 2: Prepare Your Raspberry Pi

#### Install Required Python Packages
\`\`\`bash
# SSH into your Raspberry Pi or open terminal
sudo apt-get update
sudo apt-get install python3-pip

# Install required libraries
pip3 install requests
\`\`\`

#### Download the Python Script
1. Download `raspberry_pi_realtime.py` from your project's `scripts` folder
2. Transfer it to your Raspberry Pi using:
   - USB drive
   - SCP: `scp scripts/raspberry_pi_realtime.py pi@raspberrypi.local:~/`
   - Or copy-paste the code into a new file on your Pi

### Step 3: Configure the Script

Edit the script on your Raspberry Pi:
\`\`\`bash
nano raspberry_pi_realtime.py
\`\`\`

Update these lines with your information:
\`\`\`python
# Replace with your deployed web app URL
API_BASE_URL = "https://your-app.vercel.app"

# Update sensor reading function with your actual sensor code
def read_light_sensor():
    # Replace this with your actual sensor reading code
    # Example for TSL2561 sensor:
    # import board
    # import adafruit_tsl2561
    # i2c = board.I2C()
    # sensor = adafruit_tsl2561.TSL2561(i2c)
    # return sensor.lux
    
    return random.uniform(100, 1000)  # Remove this line
\`\`\`

### Step 4: Run the Script

#### Option A: Run Manually (for testing)
\`\`\`bash
python3 raspberry_pi_realtime.py
\`\`\`

You should see output like:
\`\`\`
[2025-01-29 10:30:15] Sensor data sent successfully
[2025-01-29 10:30:17] LED Status: Manual mode, Brightness: 75%
\`\`\`

#### Option B: Run Automatically on Startup (recommended)

Create a systemd service:
\`\`\`bash
sudo nano /etc/systemd/system/light-sensor.service
\`\`\`

Add this content:
\`\`\`ini
[Unit]
Description=Light Sensor Data Collection
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

Enable and start the service:
\`\`\`bash
sudo systemctl enable light-sensor.service
sudo systemctl start light-sensor.service

# Check status
sudo systemctl status light-sensor.service

# View logs
sudo journalctl -u light-sensor.service -f
\`\`\`

### Step 5: Verify Connection

1. Open your web app in a browser: `https://your-app.vercel.app`
2. Look at the **Connection Status** card on the homepage
3. It should show:
   - **Green background** = Pi is connected and sending data
   - **Red background** = Pi is disconnected or not sending data
4. You should see real-time sensor readings updating every 2 seconds

---

## How It Works

### Data Flow
\`\`\`
Raspberry Pi → Sends sensor data every 2 seconds → Web App API
                                                      ↓
                                                  Supabase Database
                                                      ↓
                                                  Web UI (real-time updates)
\`\`\`

### Manual LED Control
When you adjust LED settings in Manual mode on the web app:
1. Settings are saved to the database
2. Your Pi checks for updates every 2 seconds
3. Pi receives the new settings and can adjust the LED accordingly

---

## Troubleshooting

### Connection Status Shows Red
- Check if the Python script is running: `sudo systemctl status light-sensor.service`
- Verify your API_BASE_URL is correct in the script
- Check Pi's internet connection: `ping google.com`
- View script logs: `sudo journalctl -u light-sensor.service -f`

### No Data Appearing
- Verify the script is sending data (check logs)
- Ensure your Supabase database tables are created (run SQL scripts)
- Check browser console for errors (F12 → Console tab)

### Export Buttons Not Working
- Make sure you have data in the database first
- Check that you're logged in (if authentication is enabled)
- Try opening the export URL directly: `https://your-app.vercel.app/api/export/sensor-data`

---

## What the User Does vs What Happens Automatically

### User Must Do:
1. Deploy the web app to Vercel
2. Set up Raspberry Pi with Python script
3. Configure the script with correct API URL
4. Run the script (manually or as a service)
5. Connect Pi to internet

### Happens Automatically:
1. Pi sends sensor data every 2 seconds
2. Web app receives and stores data
3. UI updates in real-time via Supabase Realtime
4. Alerts are generated based on thresholds
5. Pi checks for LED control changes every 2 seconds
6. Data is stored and available for export

---

## Next Steps

Once your Pi is connected and sending data:
- View real-time readings on the homepage
- Check the **Sensor Readings** page for historical data and charts
- Use **LED Control** to manually adjust LED settings
- Export data from the **Data Storage** page
- Monitor **Active Alerts** for system issues

## Need Help?
- Check the logs: `sudo journalctl -u light-sensor.service -f`
- Verify API endpoints are accessible: `curl https://your-app.vercel.app/api/led/status`
- Review the SYSTEM_OVERVIEW.md for architecture details
