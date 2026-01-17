import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    ShoppingBag,
    Megaphone,
    Archive,
    BarChart3,
    Settings,
    LogOut,
    Armchair,
    User,
    Globe,
    Package,
    Smile
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { settings } = useShop();
    const { theme } = useTheme();

    const [expandedMenu, setExpandedMenu] = React.useState(null);

    const toggleSubMenu = (label) => {
        setExpandedMenu(expandedMenu === label ? null : label);
    };

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isAdmin = ['SuperAdmin', 'Admin'].includes(user?.role);

    const handleLogout = () => {
        navigate('/');
        // Use timeout to allow navigation to unmount protected route before clearing auth
        // ensuring we land on Home instead of being redirected to Login by ProtectedRoute
        setTimeout(logout, 100);
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        { icon: Package, label: 'Inventory', path: '/admin/inventory' },
        { icon: Armchair, label: 'Chairs & Stations', path: '/admin/chairs' },
        { icon: ShoppingBag, label: 'POS & Billing', path: '/admin/pos' },
        ...(isAdmin ? [
            { icon: Users, label: 'Staff Management', path: '/admin/staff' },
            { icon: Smile, label: 'Customers', path: '/admin/customers' }
        ] : []),
        { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
        { icon: User, label: 'My Profile', path: '/admin/profile' },
    ];

    return (
        <div className={`h-screen w-64 border-r flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 backdrop-blur-xl 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            ${theme === 'dark' ? 'bg-gray-900/80 border-gray-800 text-white' : 'bg-white/80 border-gray-200 text-gray-900 shadow-xl'}`}>
            <div className="p-8 flex items-center justify-center gap-4 relative">
                {/* Mobile Close Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute right-4 top-4 md:hidden p-1 rounded-md hover:bg-white/10"
                >
                    <X className="w-5 h-5" />
                </button>
                {settings?.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="w-32 h-auto object-contain" />
                ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-2xl shadow-lg shadow-purple-500/20 text-white">
                        {settings?.salonName?.charAt(0) || 'B'}
                    </div>
                )}
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                <div className={`px-4 mb-2 text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-black'}`}>Menu</div>
                {navItems.map((item) => (
                    <div key={item.label}>
                        {item.children ? (
                            <div className="space-y-1">
                                <button
                                    onClick={() => toggleSubMenu(item.label)}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${expandedMenu === item.label
                                        ? (theme === 'dark' ? 'bg-white/5 text-white' : 'bg-gray-100 text-black')
                                        : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-black hover:bg-gray-100')
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    <div className={`transition-transform duration-200 ${expandedMenu === item.label ? 'rotate-180' : ''}`}>
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${expandedMenu === item.label ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="pl-12 pr-4 py-1 space-y-1">
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.path}
                                                to={child.path}
                                                onClick={() => isOpen && toggleSidebar()}
                                                className={({ isActive }) =>
                                                    `block px-4 py-2 rounded-lg text-sm transition-colors ${isActive
                                                        ? 'text-pink-500 font-medium bg-pink-500/10'
                                                        : (theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-black')
                                                    }`
                                                }
                                            >
                                                {child.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <NavLink
                                to={item.path}
                                onClick={() => isOpen && toggleSidebar()}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                        ? (theme === 'dark' ? 'text-white shadow-lg shadow-pink-500/10' : 'text-pink-600 bg-pink-50 border border-pink-200 font-bold shadow-sm')
                                        : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-black font-medium hover:bg-gray-200')
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-pink-500/20 rounded-xl"></div>
                                        )}
                                        <item.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-pink-500' : 'group-hover:text-pink-400'}`} />
                                        <span className={`font-medium relative z-10 ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                                        {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-500 rounded-l-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>}
                                    </>
                                )}
                            </NavLink>
                        )}
                    </div>
                ))}
            </nav>

            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-gray-300 bg-gray-100'}`}>
                <div className={`px-4 mb-2 text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-black'}`}>System</div>
                <NavLink to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all group ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-black font-medium hover:bg-white hover:text-purple-700 shadow-sm'}`}>
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-medium">Settings</span>
                </NavLink>
                <NavLink to="/" className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all group ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-black font-medium hover:bg-white hover:text-purple-700 shadow-sm'}`}>
                    <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
                    <span className="font-medium">Back to Website</span>
                </NavLink>
                <button onClick={handleLogout} className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors ${theme === 'dark' ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-500' : 'text-black font-medium hover:bg-red-100 hover:text-red-700'}`}>
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
