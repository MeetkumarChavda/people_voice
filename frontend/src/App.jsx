// frontend/src/App.jsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Oval } from 'react-loader-spinner';
import ProtectedRoute from './components/ProtectedRoutes';

const Home = lazy(() => import('./pages/Home'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MunicipalDashboard = lazy(() => import('./pages/MunicipalCorporation/MunicipalDashboard'));
const AreaCounsellorDashboard = lazy(() => import('./pages/AreaCounsellor/AreaCounsellorDashboard'));
const CitizenDashboard = lazy(() => import('./pages/Citizen/CitizenDashboard'));

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Toaster position="top-right" />
                <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen">
                        <Oval 
                            height={80} 
                            width={80} 
                            color="#4fa94d" 
                            ariaLabel='loading' 
                            secondaryColor="#4fa94d" 
                            strokeWidth={5} 
                            strokeWidthSecondary={5} 
                        />
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['superAdmin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/municipal-dashboard" element={
                            <ProtectedRoute allowedRoles={['government']}>
                                <MunicipalDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/counsellor-dashboard" element={
                            <ProtectedRoute allowedRoles={['government']}>
                                <AreaCounsellorDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/citizen-dashboard" element={
                            <ProtectedRoute allowedRoles={['citizen', 'organization']}>
                                <CitizenDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={
                            <div className="container mx-auto px-4 py-16 text-center">
                                <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                            </div>
                        } />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;