// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, User, Mail, Lock, Camera, CheckCircle, MapPin, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api.config';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await apiClient.post('/auth/login', formData);
            localStorage.setItem('token', response.token);
            
            // Store user info in localStorage for easy access
            localStorage.setItem('user', JSON.stringify(response.user));
            
            toast.success('Login successful!');
            
            // Redirect based on role
            const { role, category } = response.user;
            
            if (role === 'superAdmin') {
                navigate('/admin-dashboard');
            } else if (role === 'government') {
                if (category === 'MunicipalCorporation') {
                    navigate('/municipal-dashboard');
                } else if (category === 'AreaCounsellor') {
                    navigate('/counsellor-dashboard');
                }
            } else if (role === 'organization' || role === 'citizen') {
                navigate('/citizen-dashboard');
            }
        } catch (error) {
            const errorMessage = error.message || 'Login failed. Please check your credentials.';
            toast.error(errorMessage);
            
            // Handle specific error cases
            if (error.message?.includes('pending verification')) {
                toast.error('Your account is pending verification. Please wait for approval.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>Login | People Voice</title>
                <meta name="description" content="Log in to your People Voice account" />
            </Helmet>
            
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Left side - Form */}
                <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="flex items-center mb-8">
                            <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                                <Zap size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-blue-600">PeopleVoice</h1>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Welcome Back</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Email</label>
                                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition">
                                    <Mail className="h-5 w-5 text-blue-500 ml-3" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="flex-1 p-3 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Password</label>
                                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition">
                                    <Lock className="h-5 w-5 text-blue-500 ml-3" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="flex-1 p-3 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm transition">Forgot password?</Link>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600">
                                Don't have an account? <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-800 transition">Sign Up</Link>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Right side - Wireframe Image */}
                <div className="w-full md:w-1/2 bg-gradient-to-r from-purple-700 to-indigo-600 p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
                    {/* Abstract shapes for visual interest */}
                    <div className="absolute right-0 top-1/4 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
                    
                    {/* Wireframe elements */}
                    <div className="absolute top-1/3 right-1/4 w-32 h-32 border-4 border-purple-300/30 rounded-xl rotate-12"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-40 h-40 border-4 border-indigo-300/30 rounded-full"></div>
                    <div className="absolute top-1/4 left-1/5 w-24 h-24 border-4 border-purple-300/30 rounded-lg -rotate-12"></div>
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-800/70 to-indigo-700/70 z-0"></div>
                    
                    {/* Phone mockup with app UI */}
                    <div className="relative z-10">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 w-64 md:w-80">
                            <div className="bg-blue-50 p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <div className="bg-blue-600 text-white p-1 rounded-md">
                                            <Zap size={16} />
                                        </div>
                                        <span className="ml-2 font-medium text-gray-800">PeopleVoice</span>
                                    </div>
                                    <User size={18} className="text-gray-600" />
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <div className="flex items-center text-sm mb-1">
                                        <MapPin size={12} className="text-blue-600 mr-1" />
                                        <span className="font-medium text-gray-600">Recent Activity</span>
                                    </div>
                                    <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                                        <Camera size={24} className="text-gray-400" />
                                    </div>
                                    <div className="h-2 w-2/3 bg-gray-200 rounded-full mb-1"></div>
                                    <div className="h-2 w-1/2 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            <span className="text-sm font-medium">Recent Issues</span>
                                        </div>
                                        <span className="text-xs text-blue-600">View All</span>
                                    </div>
                                    <div className="bg-gray-100 rounded-lg p-2 flex items-center mb-2">
                                        <CheckCircle size={14} className="text-blue-500 mr-2" />
                                        <div className="flex-1">
                                            <div className="text-xs font-medium">Pothole on Main St</div>
                                            <div className="text-xs text-gray-500">In Progress</div>
                                        </div>
                                        <Clock size={14} className="text-gray-400" />
                                    </div>
                                    <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                                        <CheckCircle size={14} className="text-green-500 mr-2" />
                                        <div className="flex-1">
                                            <div className="text-xs font-medium">Street Light Repair</div>
                                            <div className="text-xs text-gray-500">Resolved</div>
                                        </div>
                                        <Clock size={14} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;