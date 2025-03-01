// frontend/src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient  from '../services/api.config';
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
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>Admin Login | People Voice</title>
            </Helmet>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="border p-2"
                        />
                    </div>
                    <div>
                        <label className="block">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border p-2"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white p-2">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;