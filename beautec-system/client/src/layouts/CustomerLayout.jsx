import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, ShoppingBag, User, LogOut, Menu, X, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useShop } from '../context/ShopContext';

const CustomerLayout = () => {
    const { user, logout } = useAuth();
    const { settings } = useShop();
    const { theme } = useTheme(); // Even if forced to dark, keeping context access is good
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        navigate('/');
        setTimeout(logout, 100);
    };

    const navItems = [
        { icon: Home, label: 'Back to Website', path: '/' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Calendar, label: 'My Bookings', path: '/my-bookings' },
        { icon: ShoppingBag, label: 'My Orders', path: '/my-orders' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="min-h-screen relative bg-black text-white overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
            {/* Global Background Image (Luxury Floral) */}
            <div className="fixed inset-0 z-0 transition-opacity duration-1000">
                <div className="absolute inset-0 bg-[url('/assets/admin-bg-floral.png')] bg-cover bg-center bg-no-repeat opacity-60 blur-sm scale-105 animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-black/40 mix-blend-overlay"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-black/80 to-black"></div>
            </div>

            {/* Glass Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl`}
            >
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-20 flex items-center px-8 border-b border-white/5">
                        {settings?.logoUrl ? (
                            <img src={settings.logoUrl} alt={settings.salonName} className="h-10 w-auto object-contain" />
                        ) : (
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 drop-shadow-lg glitch-effect">
                                {settings?.salonName || 'BEAUTEC'}
                            </h1>
                        )}
                    </div>

                    {/* Nav Items */}
                    <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                        <div className="px-4 mb-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer Portal</div>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                        ? 'text-white bg-white/10 shadow-[0_0_20px_rgba(236,72,153,0.3)] border border-white/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-medium tracking-wide">{item.label}</span>
                                {/* Glow Effect on Active */}
                                {({ isActive }) => isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-50 blur"></div>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-white/5 bg-black/20">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-[1px]">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-sm font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name || 'Guest'}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} min-h-screen relative z-10`}>
                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg hover:shadow-pink-500/40 transition-all md:hidden"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default CustomerLayout;
