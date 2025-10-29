import serial
import time

# On Windows: 'COM3', 'COM4', etc.
# On Mac: '/dev/cu.ESP32_Lux_Sensor' or similar
# On Linux: '/dev/rfcomm0' or use bluetoothctl to connect first

bt = serial.Serial('COM4', 115200, timeout=1)  # Adjust port name
print("Connected to ESP32")

while True:
    if bt.in_waiting:
        line = bt.readline().decode('utf-8').strip()
        print(line)
        # Parse: timestamp, lux1, lux2, avg
        # data = line.split(',')