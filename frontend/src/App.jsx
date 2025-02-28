import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Layout
import MainLayout from './components/Layout/MainLayout';
import LoadingContainer from './components/common/LoadingContainer';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Items = lazy(() => import('./pages/Items'));
const About = lazy(() => import('./pages/About'));

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Toaster position="top-right" />
                <Suspense fallback={<LoadingContainer fullScreen text="Loading page..." />}>
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="items" element={<Items />} />
                            <Route path="about" element={<About />} />
                            <Route path="*" element={
                                <div className="container mx-auto px-4 py-16 text-center">
                                    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                                    <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                                </div>
                            } />
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
