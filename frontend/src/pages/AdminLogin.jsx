// frontend/src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api.config';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/auth/admin/login', formData);
            localStorage.setItem('token', response.token);
            toast.success('Login successful!');
            navigate('/admin');
        } catch (error) {
            toast.error(error.message || 'Login failed!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Helmet>
                <title>Admin Login | People Voice</title>
            </Helmet>
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <div className="flex items-center mb-6">
                    <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                        <Zap size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg w-full hover:bg-blue-700 transition-all">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;