// frontend/src/pages/MunicipalDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import apiClient  from '../../services/api.config';
import { toast } from 'react-hot-toast';

const MunicipalDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Get current user info
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = JSON.parse(atob(token.split('.')[1]));
                    console.log('Current user from token:', decoded);
                    setCurrentUser(decoded);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        };
        getUserInfo();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/auth/verification-requests');
            console.log('Raw API response:', response);
            
            // The API returns { success, count, data } where data is the array of requests
            if (response && response.success && Array.isArray(response.data)) {
                console.log('Setting requests from response.data:', response.data);
                setRequests(response.data);
            } else {
                console.log('No valid data found in response');
                setRequests([]);
            }
        } catch (error) {
            console.error('Error fetching verification requests:', error);
            toast.error(error.message || 'Failed to fetch requests');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Check if the current user has permission to verify this counsellor
    const canVerify = (counsellor) => {
        if (!currentUser || !counsellor) return false;
        
        // For debugging
        console.log('Checking permission for counsellor:', counsellor);
        console.log('Current user:', currentUser);
        
        // Check if the counsellor's municipalCorporationID matches the current user's ID
        if (counsellor.subcategory && counsellor.subcategory.municipalCorporationID) {
            // Convert both IDs to strings to ensure proper comparison
            // MongoDB ObjectIDs are objects but often compared as strings
            const counsellorMunicipalCorpId = String(counsellor.subcategory.municipalCorporationID);
            const currentUserId = String(currentUser.id);
            
            console.log(`Comparing: counsellor's municipal corp ID (${counsellorMunicipalCorpId}) with current user ID (${currentUserId})`);
            console.log(`Types: counsellor ID (${typeof counsellorMunicipalCorpId}), current user ID (${typeof currentUserId})`);
            console.log(`Equality check result: ${counsellorMunicipalCorpId === currentUserId}`);
            
            // Return true if they match as strings
            return counsellorMunicipalCorpId === currentUserId;
        }
        
        return false;
    };

    const handleVerify = async (userId) => {
        try {
            console.log('Verifying user with ID:', userId);
            
            // Find the counsellor in the requests
            const counsellor = requests.find(req => req._id === userId);
            
            // Check permission
            if (!canVerify(counsellor)) {
                console.error('Permission check failed - cannot verify this user');
                toast.error("You don't have permission to verify this user");
                return; // Don't proceed with the API call
            }
            
            // Log the request payload for debugging
            const payload = { userId, approved: true };
            console.log('Verification request payload:', payload);
            
            const response = await apiClient.post('/auth/verification-requests', payload);
            console.log('Verification response:', response);
            
            if (response && response.success) {
                toast.success('Area Counsellor verified successfully!');
                // Refresh the list after verification
                fetchRequests();
            } else {
                toast.error('Verification failed: ' + (response?.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error(error.response?.message || error.message || 'Verification failed');
        }
    };

    const handleReject = async (userId) => {
        try {
            console.log('Rejecting user with ID:', userId);
            
            // Find the counsellor in the requests
            const counsellor = requests.find(req => req._id === userId);
            
            // Check permission
            if (!canVerify(counsellor)) {
                console.error('Permission check failed - cannot reject this user');
                toast.error("You don't have permission to reject this user");
                return; // Don't proceed with the API call
            }
            
            // Log the request payload for debugging
            const payload = { userId, approved: false };
            console.log('Rejection request payload:', payload);
            
            const response = await apiClient.post('/auth/verification-requests', payload);
            console.log('Rejection response:', response);
            
            if (response && response.success) {
                toast.success('Area Counsellor rejected successfully!');
                // Refresh the list after rejection
                fetchRequests();
            } else {
                toast.error('Rejection failed: ' + (response?.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Rejection error:', error);
            toast.error(error.response?.message || error.message || 'Rejection failed');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>Municipal Dashboard | People Voice</title>
            </Helmet>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Municipal Dashboard</h1>
                
                {currentUser && (
                    <div className="mt-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm">Logged in as: <strong>{currentUser.role}</strong></p>
                        {currentUser.category && (
                            <p className="text-sm">Category: <strong>{currentUser.category}</strong></p>
                        )}
                        <p className="text-sm">User ID: <strong>{currentUser.id}</strong></p>
                    </div>
                )}
                
                <h2 className="text-xl mt-4 mb-2">Pending Area Counsellor Verification Requests</h2>
                
                {loading ? (
                    <p>Loading verification requests...</p>
                ) : requests.length === 0 ? (
                    <div>
                        <p>No pending verification requests</p>
                        <button 
                            onClick={fetchRequests}
                            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <div>
                        <ul className="space-y-2 mb-4">
                            {requests.map(req => {
                                const canVerifyThis = canVerify(req);
                                return (
                                    <li key={req._id} className="flex justify-between items-center p-3 border rounded">
                                        <div>
                                            <p className="font-medium">{req.name} ({req.username})</p>
                                            <p className="text-sm text-gray-600">{req.email}</p>
                                            <p className="text-xs text-gray-500">ID: {req._id}</p>
                                            {req.subcategory && req.subcategory.municipalCorporationID && (
                                                <p className="text-xs text-gray-500">
                                                    Municipal Corp ID: {req.subcategory.municipalCorporationID}
                                                    {canVerifyThis ? 
                                                        <span className="text-green-500"> (Match)</span> : 
                                                        <span className="text-red-500"> (No Match)</span>}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-x-2">
                                            <button 
                                                onClick={() => handleVerify(req._id)} 
                                                className={`${canVerifyThis ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'} text-white px-3 py-1 rounded`}
                                                disabled={!canVerifyThis}
                                                title={!canVerifyThis ? "You don't have permission to verify this user" : ""}
                                            >
                                                Verify
                                            </button>
                                            <button 
                                                onClick={() => handleReject(req._id)} 
                                                className={`${canVerifyThis ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400'} text-white px-3 py-1 rounded`}
                                                disabled={!canVerifyThis}
                                                title={!canVerifyThis ? "You don't have permission to reject this user" : ""}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <button 
                            onClick={fetchRequests}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            Refresh List
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MunicipalDashboard;