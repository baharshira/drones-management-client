import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from "./components/Modal";
import Dropdown from "./components/Dropdown";

function App() {
    const [drones, setDrones] = useState([]);
    const [missions, setMissions] = useState([]);
    const [selectedDrone, setSelectedDrone] = useState('');
    const [selectedMission, setSelectedMission] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // If I had more time - I would build a custom hook, instead of using useEffect
    useEffect(() => {
        fetchDrones();
        fetchMissions();
    }, []);

    const fetchDrones = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/drones/status');
            setDrones(response.data);
        } catch (error) {
            console.error('Failed to fetch drones:', error);
        }
    };

    const fetchMissions = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/missions/');
            const filteredMissions = response.data.filter(mission => mission && mission._id && mission.name); // Ensure each mission has an ID and name
            setMissions(filteredMissions);
        } catch (error) {
            console.error('Failed to fetch missions:', error);
        }
    };

    const formatErrorMessage = (errorDetail) => {
        if (typeof errorDetail === 'string') {
            // If the error detail is already a string, return it directly
            return errorDetail;
        } else if (Array.isArray(errorDetail)) {
            // If the error detail is an array (e.g., list of validation errors), map it to a list of strings
            return errorDetail.map(detail => detail.msg).join(", ");
        } else if (typeof errorDetail === 'object') {
            // If the error detail is an object, format it
            return Object.entries(errorDetail).map(([key, value]) => `${key}: ${value}`).join(", ");
        } else {
            return 'An unexpected error occurred.';
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // The post method uses the structure of schedule schema
        try {
            await axios.post('http://127.0.0.1:8000/schedules/', {
                drone: selectedDrone,
                mission: selectedMission,
                start: startDate,
                end: endDate,
                status: 'occupied',
            });
            setModalMessage('Drone scheduled successfully!');
            setIsModalOpen(true);
        } catch (error) {
            const errorDetails = error.response?.data?.detail;
            const formattedErrorMessage = formatErrorMessage(errorDetails);
            setModalMessage(formattedErrorMessage);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="App">
            <h1>Schedule a Drone</h1>
            <form onSubmit={handleFormSubmit}>
                <label>
                    <Dropdown
                        label="Available Drones:"
                        items={drones}
                        value={selectedDrone}
                        onChange={e => setSelectedDrone(e.target.value)}
                        placeholder="Select a Drone"
                    />
                </label>
                <br />
                <label>
                    <Dropdown
                        label="Choose Your Mission:"
                        items={missions}
                        value={selectedMission}
                        onChange={e => setSelectedMission(e.target.value)}
                        placeholder="Select a Mission"
                    />
                </label>
                <br />
                <label>
                    Start Date and Time:
                    <input type="datetime-local" required value={startDate} onChange={e => setStartDate(e.target.value)} />
                </label>
                <br />
                <label>
                    End Date and Time:
                    <input type="datetime-local" required value={endDate} onChange={e => setEndDate(e.target.value)} />
                </label>
                <br />
                <button type="submit">Schedule Drone</button>
            </form>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
}

export default App;
