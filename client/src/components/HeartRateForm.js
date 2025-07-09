import React, { useState } from 'react';
import axios from 'axios';

const HeartRateForm = () => {
    const [rate, setRate] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Sending heart rate to backend:", rate); // Debugging line
            const res = await axios.post('http://localhost:5000/api/heart-rate/analyze', { rate });
            console.log("Received response:", res.data); // Debugging line
            setResult(res.data);
        } catch (error) {
            console.error("Error analyzing heart rate:", error);
            alert('Error submitting heart rate. Please try again.');
        }
    };    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Enter Heart Rate"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    required
                />
                <button type="submit">Analyze</button>
            </form>

            {result && (
                <div>
                    <h3>Analysis Result</h3>
                    <p>Heart Rate: {result.rate}</p>
                    <p>Activity: {result.activity}</p>
                    {result.emergency && (
                        <div style={{ color: 'red' }}>
                            <h4>Emergency Alert!</h4>
                            <p>{result.emergencyMessage}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HeartRateForm;
