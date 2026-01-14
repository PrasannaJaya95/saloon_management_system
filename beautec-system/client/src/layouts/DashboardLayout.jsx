import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="bg-black min-h-screen text-white relative">
            {/* Global Background Image */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('/assets/dashboard-bg.png')] bg-cover bg-center bg-no-repeat opacity-40 blur-xl scale-110"></div>
                <div className="absolute inset-0 bg-black/60"></div>
                {/* mesh overlay for extra depth */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80"></div>
            </div>

            <Sidebar />

            <div className="pl-64 min-h-screen relative z-10 transition-all duration-300">
                <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-40 transition-all duration-300 backdrop-blur-sm bg-black/10">
                    <div>
                        {/* Breadcrumbs or Title could go here */}
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white tracking-wide">Alexandra Chen</p>
                            <p className="text-xs text-pink-400 font-medium tracking-wider uppercase">Manager</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] shadow-lg shadow-purple-500/20 cursor-pointer hover:scale-105 transition-transform">
                            <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Alexandra+Chen&background=random" alt="User" className="w-full h-full object-cover" />
                            </div>
                        </div>
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
