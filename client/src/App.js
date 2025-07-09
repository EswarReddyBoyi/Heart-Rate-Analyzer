import React from 'react';
import './App.css';
import HeartRateForm from './components/HeartRateForm';

function App() {
    return (
        <div className="card">
            <h1>Heart Rate Analyzer</h1>
            <HeartRateForm />

            <footer>
                <p>&copy; 2024 Heart Rate Analyzer</p>
            </footer>
        </div>
    );
}

export default App;

