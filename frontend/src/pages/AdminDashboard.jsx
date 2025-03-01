// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import apiClient from "../services/api.config";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await apiClient.get(
                    "/auth/verification-requests"
                );
                setRequests(response.data);
            } catch (error) {
                toast.error(error.message || "Failed to fetch requests");
            }
        };
        fetchRequests();
    }, []);

    const handleVerify = async (userId) => {
        try {
            await apiClient.post("/auth/verification-requests", {
                userId,
                approved: true,
            });
            toast.success("User verified successfully!");
            setRequests(requests.filter((req) => req.id !== userId));
        } catch (error) {
            toast.error(error.message || "Verification failed");
        }
    };

    const handleReject = async (userId) => {
        try {
            await apiClient.post("/auth/verification-requests", {
                userId,
                approved: false,
            });
            toast.success("User rejected successfully!");
            setRequests(requests.filter((req) => req.id !== userId));
        } catch (error) {
            toast.error(error.message || "Rejection failed");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>Admin Dashboard | People Voice</title>
            </Helmet>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                <div className="bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold p-4 border-b">
                        Pending Verification Requests
                    </h2>
                    {requests.length === 0 ? (
                        <p className="p-4 text-gray-500">
                            No pending verification requests
                        </p>
                    ) : (
                        <ul className="divide-y">
                            {requests.map((req) => (
                                <li
                                    key={req._id}
                                    className="p-4 flex items-center justify-between"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {req.username}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {req.role} - {req.category}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {req.email}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleVerify(req._id)
                                            }
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                        >
                                            Verify
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleReject(req._id)
                                            }
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
