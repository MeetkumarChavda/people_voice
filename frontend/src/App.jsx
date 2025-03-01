import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Toaster position="top-right" />
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
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
