const express = require('express');
const router = express.Router();
const heartRateController = require('../controllers/heartRateController');

// Analyze heart rate
router.post('/', (req, res) => {
    const heartRate = req.body.rate;
    console.log('Received heart rate:', heartRate);
    // Process the heart rate here (e.g., store it, analyze it, etc.)
    res.status(200).send({ message: 'Heart rate received successfully' });
});

module.exports = router;