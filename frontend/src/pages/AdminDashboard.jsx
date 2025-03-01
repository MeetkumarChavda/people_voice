// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import apiClient  from '../services/api.config';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await apiClient.get('/auth/verification-requests');
                setRequests(response.data);
            } catch (error) {
                toast.error(error.message || 'Failed to fetch requests');
            }
        };
        fetchRequests();
    }, []);

    const handleVerify = async (userId) => {
        try {
            await apiClient.post('/auth/verification-requests', { userId, approved: true });
            toast.success('User verified successfully!');
            setRequests(requests.filter(req => req.id !== userId));
        } catch (error) {
            toast.error(error.message || 'Verification failed');
        }
    };

    const handleReject = async (userId) => {
        try {
            await apiClient.post('/auth/verification-requests', { userId, approved: false });
            toast.success('User rejected successfully!');
            setRequests(requests.filter(req => req.id !== userId));
        } catch (error) {
            toast.error(error.message || 'Rejection failed');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>Admin Dashboard | People Voice</title>
            </Helmet>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <h2 className="text-xl">Pending Verification Requests</h2>
                <ul>
                    {requests.map(req => (
                        <li key={req.id} className="flex justify-between">
                            <span>{req.username}</span>
                            <div>
                                <button onClick={() => handleVerify(req.id)} className="bg-green-500 text-white p-1">Verify</button>
                                <button onClick={() => handleReject(req.id)} className="bg-red-500 text-white p-1">Reject</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;