"""
Example Python script for Raspberry Pi to send data to the web app.
Install required packages: pip install requests
"""

import requests
import time
import json

# Your deployed web app URL (replace with your actual URL)
BASE_URL = "https://your-app.vercel.app"

# Example: Send sensor reading
def send_sensor_reading(actual_intensity, expected_intensity=None, temperature=None, humidity=None, latitude=None, longitude=None):
    """Send light sensor reading to the web app"""
    url = f"{BASE_URL}/api/sensor"
    
    data = {
        "actual_intensity": actual_intensity,
        "expected_intensity": expected_intensity,
        "temperature": temperature,
        "humidity": humidity,
        "latitude": latitude,
        "longitude": longitude
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        response.raise_for_status()
        print(f"✓ Sensor reading sent: {response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"✗ Error sending sensor reading: {e}")
        return None

# Example: Get current LED settings
def get_led_status():
    """Fetch current LED control settings from the web app"""
    url = f"{BASE_URL}/api/led/status"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        status = response.json()
        print(f"✓ LED status received: {status}")
        return status.get('status')
    except requests.exceptions.RequestException as e:
        print(f"✗ Error fetching LED status: {e}")
        return None

# Example: Upload CCTV footage metadata
def upload_cctv_metadata(file_name, file_url, file_size=None, duration=None, notes=None):
    """Upload CCTV footage metadata to the web app"""
    url = f"{BASE_URL}/api/cctv/upload"
    
    data = {
        "file_name": file_name,
        "file_url": file_url,
        "file_size": file_size,
        "duration": duration,
        "notes": notes
    }
    
    try:
        response = requests.post(url, json=data, timeout=10)
        response.raise_for_status()
        print(f"✓ CCTV metadata uploaded: {response.json()}")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"✗ Error uploading CCTV metadata: {e}")
        return None

# Main loop example
def main():
    print("Starting Raspberry Pi data sender...")
    
    while True:
        # Example: Read sensor (replace with actual sensor reading code)
        actual_intensity = 850.5  # Replace with actual sensor value
        temperature = 22.5
        humidity = 45.0
        
        # Send sensor reading
        send_sensor_reading(
            actual_intensity=actual_intensity,
            temperature=temperature,
            humidity=humidity,
            latitude=37.7749,  # Replace with actual GPS
            longitude=-122.4194
        )
        
        # Check LED settings and apply them
        led_status = get_led_status()
        if led_status:
            # Apply LED settings to your hardware
            print(f"Applying LED settings: Power={led_status['led_status']}, Brightness={led_status['brightness']}")
            # Add your LED control code here
        
        # Wait before next reading (e.g., every 30 seconds)
        time.sleep(30)

if __name__ == "__main__":
    main()
