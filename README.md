# 🫀 Heart Rate Analyzer using BLE and ML Integration

A smart health monitoring system that reads heart rate data from a BLE-enabled sensor (e.g., DFRobot Beetle ESP32-C3), sends it to a Node.js + MongoDB backend for real-time analysis, and optionally alerts emergency contacts via email or call when abnormal rates are detected. The system uses a dataset and ML logic for classification.

<img src="./Hardware/heart_rate_monitor_circuit_diagram.png" width="500"/>

---

## 🚀 Features

- 📡 Real-time heart rate monitoring via Bluetooth (BLE)
- 📈 Activity analysis based on a trained dataset
- ☎️ Emergency alerts via Twilio (calls + emails)
- 🌐 Web UI to input and visualize heart rate data
- 🧠 Machine Learning-ready structure (dataset-based predictions)
- 🗃️ MongoDB database for storing heart rate history

---

## 🧪 Technologies Used

| Layer           | Tech Stack                                   |
|----------------|-----------------------------------------------|
| Frontend       | React, Axios                                  |
| BLE Client     | Python, Bleak                                 |
| Backend        | Node.js, Express                              |
| DB             | MongoDB Atlas                                 |
| ML Logic       | CSV dataset + JS Logic (ready for ML upgrade) |
| Notifications  | Nodemailer (Gmail), Twilio (Call)             |

---

## 🧰 Installation

### 1. Clone the repo
```bash
git clone https://github.com/your-username/heart-rate-analyzer.git
cd heart-rate-analyzer
````
### 2. Backend Setup (/server)
```bash
cd server
npm install
node server.js
````
### 3. Frontend Setup (/client)
```bash
cd client
npm install
npm start
````
### 4. BLE Client (Python)
```bash
cd client
pip install bleak requests
python ble_client.py
````
🧠 ML Integration
Uses heart_rate_activity_dataset.csv for intelligent activity analysis

Predicts activity type based on heart rate value

Ready to extend with custom ML/DL models:

XRSTH-LSTM

EMD-LSTM

EMD-NLSTM

EMD-BILSTM



🧑‍💻 Contributors

Group Members: [Likith Sai E, Uday Karthikeya N, Eswar Reddy B, NLS Karthikeya, Jayanth N, Darshan Sagar, VaraPrasad K]

📎 License
This project is for academic use only. Not for medical or commercial deployment.


