import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    ShoppingBag,
    Megaphone,
    Archive,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Staff Integration', path: '/admin/staff' },
        { icon: ShoppingBag, label: 'POS & Billing', path: '/admin/pos' },
        { icon: Megaphone, label: 'Marketing', path: '/admin/marketing' },
        { icon: Archive, label: 'Inventory', path: '/admin/inventory' },
        { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 flex flex-col text-white fixed left-0 top-0 z-50 transition-all duration-300">
            <div className="p-8 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-2xl shadow-lg shadow-purple-500/20">B</div>
                <span className="font-bold text-2xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Beautec<span className="text-pink-500">+</span></span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">Menu</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                ? 'text-white shadow-lg shadow-pink-500/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">System</div>
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all group">
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-medium">Settings</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
