import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
        // You can add auth token here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
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

export default apiClient; 