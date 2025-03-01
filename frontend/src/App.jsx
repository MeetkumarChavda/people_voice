// frontend/src/App.jsx
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import L from 'leaflet';
import { Oval } from 'react-loader-spinner';
import ProtectedRoute from './components/ProtectedRoutes';
import './i18n/i18n'; // Import i18n configuration

const Home = lazy(() => import('./pages/Home'));
const CitizenFeed = lazy(() => import('./pages/Citizen/CitizenFeed'));
const Profile = lazy(() => import('./pages/Citizen/Profile'));
const Notifications = lazy(() => import('./pages/Citizen/Notifications'));
const MyReports = lazy(() => import('./pages/Citizen/MyReports'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MunicipalDashboard = lazy(() => import('./pages/MunicipalCorporation/MunicipalDashboard'));
const AreaCounsellorDashboard = lazy(() => import('./pages/AreaCounsellor/AreaCounsellorDashboard'));
function App() {
    return (
        <HelmetProvider>
            <Helmet>
                <link 
                    rel="stylesheet" 
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                />
                <script 
                    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                    crossOrigin=""
                ></script>
            </Helmet>
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
                        <Route path="/feed" element={<CitizenFeed />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/my-reports" element={<MyReports />} />
                        <Route path="/issue/:id" element={<CitizenFeed />} />
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
                            <AreaCounsellorDashboard/>
                        } />
                        <Route path="/citizenfeed" element={
                            <ProtectedRoute allowedRoles={['citizen', 'organization']}>
                                <CitizenFeed />
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