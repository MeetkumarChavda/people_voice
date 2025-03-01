// frontend/src/pages/CitizenDashboard.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const CitizenDashboard = () => {
    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>Citizen Dashboard | People Voice</title>
            </Helmet>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Citizen Dashboard</h1>
                <p>Welcome to your dashboard!</p>
            </div>
        </div>
    );
};

export default CitizenDashboard;