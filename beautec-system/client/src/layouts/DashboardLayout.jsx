import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import { useTheme } from '../context/ThemeContext';
import { Menu } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false); // Default closed on mobile, open on desktop via CSS checking? No, simpler to use state and media queries or just classes.

    // Simple mobile toggle logic
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={`min-h-screen relative transition-colors duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Global Background Image */}
            <div className="fixed inset-0 z-0 transition-opacity duration-500">
                <div className={`absolute inset-0 bg-[url('/assets/admin-bg-floral.png')] bg-cover bg-center bg-no-repeat transition-all duration-500 
                    ${theme === 'dark' ? 'opacity-80 blur-sm scale-105' : 'opacity-20 blur-sm scale-110 saturate-0 brightness-125'}`}></div>

                {theme === 'dark' ? (
                    <>
                        <div className="absolute inset-0 bg-black/40 mix-blend-overlay"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/90"></div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-white/70 mix-blend-lighten"></div>
                )}
            </div>

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`md:pl-64 min-h-screen relative z-10 transition-all duration-300 ${isSidebarOpen ? 'pl-0' : ''}`}>
                <header className={`h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 transition-all duration-300 backdrop-blur-sm ${theme === 'dark' ? 'bg-black/10' : 'bg-white/50 border-b border-gray-200/50'}`}>
                    <div className="flex items-center gap-4">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={toggleSidebar}
                            className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'text-white bg-gray-800' : 'text-black bg-gray-200'}`}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/admin/profile" className="flex items-center gap-3 group">
                            <div className="text-right hidden sm:block">
                                <p className={`text-sm font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{user?.name || 'User'}</p>
                                <p className={`text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`}>{user?.role || 'Guest'}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] shadow-lg shadow-purple-500/20 cursor-pointer group-hover:scale-105 transition-transform">
                                <div className={`w-full h-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                                    <img src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </header>

                <main className="p-8 pb-12 animate-in fade-in duration-500 slide-in-from-bottom-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
