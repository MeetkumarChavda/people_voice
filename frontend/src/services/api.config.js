import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for common headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Handle common errors here
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);
            throw error.response.data;
        } else if (error.request) {
            // Request was made but no response
            console.error('Network Error:', error.request);
            throw new Error('Network error - no response received');
        } else {
            // Something else happened
            console.error('Error:', error.message);
            throw error;
        }
    }
);

// API Endpoints:
// - POST /auth/register - Register a new user
// - POST /auth/login - Login a user
// - GET /users/municipal-corporations - Get all verified municipal corporations (for area counsellor signup)

export default apiClient; 