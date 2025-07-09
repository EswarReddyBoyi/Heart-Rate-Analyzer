const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  // MongoDB connection
const bodyParser = require('body-parser');
const heartRateRoutes = require('./routes/heartRate');
const { sendEmergencyAlert, analyzeHeartRate } = require('./controllers/heartRateController');
const mongoose = require('mongoose');

const app = express();

// Connect to the database
connectDB();

// Enable CORS and body parser middleware
app.use(cors());
app.use(bodyParser.json());

// Test email sending on server startup (optional)
sendEmergencyAlert()
  .then(() => console.log('Test alert sent.'))
  .catch(err => console.log(err));

// Heart rate routes
app.use('/api/heart-rate', heartRateRoutes);

// Redirect heart rate analysis to controller
app.post('/api/heart-rate/analyze', analyzeHeartRate);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
