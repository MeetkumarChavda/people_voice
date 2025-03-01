import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, User, Mail, Lock, Camera, CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Sign Up | People Voice</title>
        <meta name="description" content="Create your account on People Voice and start reporting community issues" />
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
            
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Your Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Name</label>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition">
                  <User className="h-5 w-5 text-blue-500 ml-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="flex-1 p-3 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
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
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Sign Up
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 transition">Log In</Link>
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
                    <span className="font-medium text-gray-600">Create Account</span>
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
                      <span className="text-sm font-medium">Join Community</span>
                    </div>
                    <span className="text-xs text-blue-600">Benefits</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 flex items-center mb-2">
                    <CheckCircle size={14} className="text-green-500 mr-2" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">Report Issues</div>
                      <div className="text-xs text-gray-500">Help your community</div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                    <CheckCircle size={14} className="text-green-500 mr-2" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">Track Progress</div>
                      <div className="text-xs text-gray-500">See real change happen</div>
                    </div>
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

export default SignUpPage; 