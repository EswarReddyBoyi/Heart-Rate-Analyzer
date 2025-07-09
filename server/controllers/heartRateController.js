const fs = require('fs');
const csv = require('csv-parser');
const HeartRate = require('../models/HeartRate');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const ss = require('simple-statistics');

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const VoiceResponse = twilio.twiml.VoiceResponse;

let dataset = [];

// Load dataset from CSV
const loadDataset = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream('./dataset/heart_rate_activity_dataset.csv')
            .pipe(csv())
            .on('data', (row) => {
                dataset.push(row);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

// Send alert email
const sendEmergencyAlert = async () => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL,
        subject: 'Heart Rate Emergency Alert',
        text: 'A panic mode has been detected! Immediate attention is required.'
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Emergency alert sent: ' + info.response);
    });
};

// Make a phone call via Twilio for emergencies
const callEmergencyService = (message) => {
    const response = new VoiceResponse();
    response.say(message);

    client.calls.create({
        twiml: response.toString(),  // Convert VoiceResponse to TwiML string
        to: process.env.EMERGENCY_PHONE_NUMBER,
        from: process.env.TWILIO_PHONE_NUMBER
    })
    .then(call => console.log("Call initiated:", call.sid))
    .catch(err => console.error("Error making call:", err));
};

// Estimate activity based on heart rate
const estimateActivity = (rate) => {
    const rates = dataset.map(row => parseFloat(row['Heart Rate']));
    const activities = dataset.map(row => row['Activity']);

    const closestRate = rates.reduce((prev, curr) => {
        return (Math.abs(curr - rate) < Math.abs(prev - rate) ? curr : prev);
    });

    const index = rates.indexOf(closestRate);
    return activities[index];
};

// Analyze heart rate and determine actions
const analyzeHeartRate = async (req, res) => {
    const { rate } = req.body;
    let activity = "Unknown";
    let emergency = false;
    let emergencyMessage = "";

    const foundActivity = dataset.find(entry => parseFloat(entry['Heart Rate']) === rate);
    if (foundActivity) {
        activity = foundActivity['Activity'];
    } else {
        activity = estimateActivity(rate);
        dataset.push({ 'Heart Rate': rate, 'Activity': activity });
    }

    if (activity === "Intensivee") {
        emergency = true;
        emergencyMessage = "Intensive activity detected. Sending alert to emergency contacts.";
        await sendEmergencyAlert();
    } else if (activity === "Panic Attack") {
        emergency = true;
        emergencyMessage = "Panic mode detected. Sending alert to emergency contacts.";
        await sendEmergencyAlert();
    } else if (activity === "Intensive") {
        emergency = true;
        emergencyMessage = "Heart attack detected! Calling emergency services.";
        callEmergencyService("Heart attack detected! Please send an ambulance immediately.");
    }

    const newHeartRate = new HeartRate({ rate, cause: activity });
    await newHeartRate.save();

    res.json({
        rate,
        activity,
        emergency,
        emergencyMessage,
    });
};

// Load dataset when server starts
loadDataset()
    .then(() => console.log("Dataset loaded successfully."))
    .catch(error => console.error("Error loading dataset:", error));

module.exports = {
    sendEmergencyAlert,
    analyzeHeartRate,
};
