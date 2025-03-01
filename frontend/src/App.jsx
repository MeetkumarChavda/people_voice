import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import L from 'leaflet';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const CitizenFeed = lazy(() => import('./pages/Citizen/CitizenFeed'));
const Profile = lazy(() => import('./pages/Citizen/Profile'));
const Notifications = lazy(() => import('./pages/Citizen/Notifications'));
const MyReports = lazy(() => import('./pages/Citizen/MyReports'));

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
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/feed" element={<CitizenFeed />} />
                        <Route path="/citizenfeed" element={<CitizenFeed />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/my-reports" element={<MyReports />} />
                        <Route path="/issue/:id" element={<CitizenFeed />} />
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
