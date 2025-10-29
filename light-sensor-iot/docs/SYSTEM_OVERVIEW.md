# Light Intensity Monitoring System - Overview

## System Architecture

This IoT web application monitors light intensity in real-time using a Raspberry Pi with sensors, providing automated analysis, LED control, and data storage.

### Components

1. **Raspberry Pi** - Hardware device with light sensors
2. **Web Application** - Next.js app hosted on Vercel
3. **Supabase Database** - Real-time data storage
4. **LED Chamber** - Controlled lighting system

## How It Works

### 1. Real-Time Data Flow

**Raspberry Pi → Web App:**
- Pi continuously reads light sensor data
- Sends readings to `/api/sensor` endpoint every few seconds
- Data is stored in Supabase database
- Web app receives real-time updates via Supabase Realtime
- All connected users see live data without page refresh

**Web App → Raspberry Pi:**
- User adjusts LED controls in Manual mode
- Settings saved to database
- Pi polls `/api/led/status` every 2 seconds
- Pi receives new settings and adjusts LED chamber

### 2. Connection Status

The web app displays Raspberry Pi connection status with visual indicators:

- **Green (Connected)**: Receiving data within last 30 seconds
- **Red (Disconnected)**: No data received for 30+ seconds

### 3. Automatic Alert Generation

Alerts are generated automatically based on:

**Sensor Deviation Alerts:**
- **Critical (>50% deviation)**: Red alert, immediate attention needed
- **High (>30% deviation)**: Orange alert, significant difference
- **Medium (>15% deviation)**: Yellow alert, moderate difference

**System Status Alerts:**
- **Connection Lost**: Generated if no data received for 2+ minutes
- **LED Chamber Issues**: Generated if LED control fails

Alerts appear on the homepage and are stored in the database. The system prevents duplicate alerts within 5-minute windows.

### 4. Data Storage & Export

All data is automatically stored in Supabase:

**Sensor Readings:**
- Light intensity measurements
- GPS coordinates
- Weather conditions
- Deviations from expected values

**LED Control History:**
- Manual/Auto mode changes
- Brightness and color adjustments
- Data source selections (Sensor/GPS/Combined)

**GPS & Environmental Data:**
- Location coordinates
- Sun angle calculations
- Weather conditions
- Temperature, humidity, wind speed

**CCTV Footage:**
- Video metadata and timestamps
- File information

**Alerts:**
- All system alerts with severity levels
- Timestamps and resolution status

### 5. Export Functionality

Users can download CSV files for all data types:
- Sensor readings
- GPS & environmental data
- LED control history
- CCTV metadata
- System alerts

Click the download buttons on the Data Storage page to export.

### 6. LED Control Modes

**Manual Mode:**
- User directly controls brightness and color temperature
- Settings sent to Raspberry Pi in real-time
- Pi adjusts LED chamber immediately

**Auto Mode:**
- System automatically adjusts LEDs based on data source:
  - **Sensor Only**: Uses actual light sensor readings
  - **Sensor + GPS**: Combines sensor data with GPS/weather calculations
  - **GPS Only**: Uses expected intensity from sun angle and weather

### 7. Setup Requirements

**Raspberry Pi Setup:**
1. Install Python 3.7+
2. Install required packages: `pip install requests`
3. Connect light sensor to Pi
4. Run the provided Python script: `python3 raspberry_pi_realtime.py`
5. Script will continuously send data to your web app

**Web App Setup:**
1. Deploy to Vercel (click "Publish" button)
2. Supabase integration is already configured
3. Run SQL scripts to create database tables
4. Update Pi script with your deployed URL

### 8. Maintenance Notes

The "maintenance" function was removed as it was a placeholder. The system is designed to run continuously without manual maintenance. Key features:

- Automatic data storage
- Real-time synchronization
- Automatic alert generation
- Connection monitoring
- Data export capabilities

All system operations are automated and require no manual intervention beyond initial setup.

## API Endpoints

- `POST /api/sensor` - Receive sensor data from Pi
- `GET /api/led/status` - Pi polls for LED control settings
- `POST /api/cctv/upload` - Upload CCTV metadata
- `GET /api/export/*` - Export data as CSV files

## Questions?

Refer to `REALTIME_SETUP.md` for detailed Raspberry Pi setup instructions.
