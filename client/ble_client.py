import asyncio
import requests
from bleak import BleakClient, BleakScanner
import platform
from datetime import datetime

# Define the BLE device address (replace this with the correct BLE address)
ADDRESS = "34:85:18:F8:28:D6"

# Define the UUIDs for the service and characteristics
SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"  # UART service UUID
CHARACTERISTIC_UUID_RX = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"  # RX characteristic UUID (Write)
CHARACTERISTIC_UUID_TX = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"  # TX characteristic UUID (Notify)
CHARACTERISTIC_UUID_TIME_RX = "6E400004-B5A3-F393-E0A9-E50E24DCCA9E"

# Function to handle received data (notification handler)
def notification_handler(sender, data):
    """Handles received data from the BLE device."""
    heart_rate = int(data.decode('utf-8'))
    print(f"Received heart rate: {heart_rate}")
    #print(data)

    # Send the received heart rate to the server
    send_heart_rate_to_server(heart_rate)

def send_heart_rate_to_server(heart_rate):
    """Send the received heart rate to the Node.js server for analysis."""
    url = "http://localhost:5000/api/heart-rate/analyze"  # Ensure this matches your server route
    payload = {"rate": heart_rate}  # Update key to match server expectations
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print(f"Server response: {response.json()}")
        else:
            print(f"Failed to send data to the server: {response.status_code}")
    except Exception as e:
        print(f"Error sending data to server: {e}")

# Main function for connecting and communicating with the BLE device
async def connect_ble_device():
    # Scan for device first (Optional, just to verify the address is correct)
    devices = await BleakScanner.discover()
    for device in devices:
        if device.address == ADDRESS:
            print(f"Found the target device: {device.name} at address {device.address}")
            break

    # Connect to the BLE device
    async with BleakClient(ADDRESS) as client:
        print("Connected to device")

        # Start receiving notifications from the TX characteristic
        await client.start_notify(CHARACTERISTIC_UUID_TX, notification_handler)

        # Send a message to the BLE device via the RX characteristic
        current_time = datetime.now().strftime("%H:%M:%S")
        print(f"Sending current time: {current_time}")

        # Write the current time to the characteristic
        await client.write_gatt_char(CHARACTERISTIC_UUID_TIME_RX, current_time.encode())
        print("Time sent successfully")

        # Wait for notifications indefinitely
        await asyncio.sleep(50)

        # Stop notifications
        await client.stop_notify(CHARACTERISTIC_UUID_TX)
        print("Notifications stopped")

# Event loop handling
def run_main():
    if platform.system() == "Windows":
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(connect_ble_device())
    else:
        asyncio.run(connect_ble_device())

# Execute the program
if __name__ == "__main__":
    run_main()
