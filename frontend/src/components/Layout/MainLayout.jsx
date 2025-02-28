import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-xl font-bold">
                            People Voice
                        </Link>
                        <div className="flex space-x-4">
                            <Link to="/" className="hover:text-blue-200 transition-colors">
                                Home
                            </Link>
                            <Link to="/items" className="hover:text-blue-200 transition-colors">
                                Items
                            </Link>
                            <Link to="/about" className="hover:text-blue-200 transition-colors">
                                About
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 py-6">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>© {new Date().getFullYear()} People Voice. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout; 