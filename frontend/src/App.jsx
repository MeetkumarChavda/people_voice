import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Oval } from 'react-loader-spinner';

const Home = lazy(() => import('./pages/Home'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));

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
