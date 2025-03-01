// frontend/src/pages/AreaCounsellorDashboard.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const AreaCounsellorDashboard = () => {
    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>Area Counsellor Dashboard | People Voice</title>
            </Helmet>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Area Counsellor Dashboard</h1>
                <p>Welcome to your dashboard!</p>
            </div>
        </div>
    );
};

export default AreaCounsellorDashboard;