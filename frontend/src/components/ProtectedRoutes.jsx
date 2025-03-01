// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    
    // If no token exists, redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    try {
        // Decode the JWT token to get user information
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userRole = decodedToken.role;
        const isVerified = decodedToken.verified;
        
        // Check if user has the required role
        if (allowedRoles && !allowedRoles.includes(userRole)) {
            toast.error('You do not have permission to access this page');
            return <Navigate to="/" />;
        }
        
        // For government roles, check if they are verified
        if (userRole === 'government' && !isVerified) {
            toast.error('Your account is pending verification. Please wait for approval.');
            // Clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return <Navigate to="/login" />;
        }
        
        // If all checks pass, render the protected component
        return children;
    } catch (error) {
        console.error('Error decoding token:', error);
        // If token is invalid, clear it and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;