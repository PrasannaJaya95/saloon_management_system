import React from 'react';
import { Users, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const stats = [
        { title: 'Today\'s Revenue', value: 'Rs. 3,450.00', icon: TrendingUp, trend: '+15%', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { title: 'Appointments', value: '24', icon: Calendar, trend: '8 pending', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { title: 'Active Staff', value: '12', icon: Users, trend: 'All checked in', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { title: 'Total Sales', value: '156', icon: CreditCard, trend: '+2 this hour', color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-black to-gray-800'}`}>Dashboard Overview</h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-black'} mt-1 font-medium`}>Welcome back, here's what's happening today.</p>
                </div>
                <div className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-500 border-gray-800 bg-gray-900/50' : 'text-black border-gray-300 bg-white shadow-sm'} border rounded-lg px-4 py-2`}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        onClick={() => {
                            if (stat.title === "Today's Revenue") navigate('/admin/orders?date=today');
                        }}
                        className={`p-6 rounded-3xl backdrop-blur-md transition-all duration-300 group relative overflow-hidden 
                        shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.3)] hover:-translate-y-1
                        ${theme === 'dark'
                                ? 'bg-gray-900/40 border border-gray-700/50 hover:border-pink-500/50'
                                : 'bg-white border border-gray-100 hover:border-pink-500/30 hover:shadow-xl'}
                        ${stat.title === "Today's Revenue" ? 'cursor-pointer' : ''}`}
                    >
                        {/* 3D Glass Highlight - Visible in both modes now */}
                        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${theme === 'dark' ? 'via-white/20' : 'via-black/10'} to-transparent`}></div>
                        <div className={`absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent ${theme === 'dark' ? 'via-white/10' : 'via-black/5'} to-transparent`}></div>

                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} ${theme === 'dark' ? 'opacity-20' : 'opacity-10'} rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-40`}></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            {/* 3D Icon Container */}
                            <div className={`w-14 h-14 rounded-2xl text-white border-t border-l border-white/20 shadow-lg flex items-center justify-center
                            bg-gradient-to-br ${stat.color.replace('from-', 'from-').replace('to-', 'to-')} group-hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'shadow-black/40' : 'shadow-gray-200'}`}>
                                <stat.icon className="w-7 h-7 drop-shadow-md text-white" />
                            </div>
                            {stat.trend && (
                                <span className={`text-xs font-bold text-green-500 px-3 py-1.5 rounded-full border flex items-center gap-1 shadow-inner ${theme === 'dark' ? 'bg-gray-900/80 border-green-500/30' : 'bg-green-50 border-green-200'}`}>
                                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                                </span>
                            )}
                        </div>
                        <div className="relative z-10">
                            <p className={`text-sm font-bold tracking-wide drop-shadow-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{stat.title}</p>
                            <h3 className={`text-3xl font-bold mt-2 group-hover:scale-105 transition-transform origin-left drop-shadow-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 p-8 rounded-3xl backdrop-blur-xl border relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-300 shadow-xl shadow-gray-300/50'}`}>
                    <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-b pointer-events-none ${theme === 'dark' ? 'from-transparent to-black/20' : 'from-transparent to-gray-100/50'}`}></div>
                    <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Revenue Analytics</h3>

                    {/* CSS-only Mock Chart */}
                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <div key={i} className="w-full rounded-t-lg relative group h-full flex items-end bg-transparent">
                                <div className={`w-full h-full absolute bottom-0 rounded-t-lg opacity-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                                <div
                                    style={{ height: `${h}%` }}
                                    className="w-full bg-gradient-to-t from-purple-900/50 to-pink-500/50 rounded-t-lg transition-all duration-500 group-hover:to-pink-400 relative z-10"
                                >
                                    <div className={`absolute -top-10 left-1/2 -translate-x-1/2 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200 shadow-md'}`}>
                                        Rs. {h * 100}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`flex justify-between mt-4 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-black'}`}>
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                <div className={`p-8 rounded-3xl backdrop-blur-xl border flex flex-col ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-300 shadow-xl shadow-gray-300/50'}`}>
                    <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start group">
                                <div className="w-2 h-2 mt-2 rounded-full bg-pink-500 ring-4 ring-pink-500/10 group-hover:ring-pink-500/30 transition-all"></div>
                                <div>
                                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-black'}`}>New appointment booking #10{20 + i}</p>
                                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>2 mins ago • Sarah Connor</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-4 items-start group">
                            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 ring-4 ring-blue-500/10"></div>
                            <div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>New staff member added</p>
                                <p className="text-xs text-gray-500 mt-1">1 hour ago • Admin</p>
                            </div>
                        </div>
                    </div>
                    <button className={`mt-auto w-full py-3 rounded-xl border text-sm font-bold transition-colors ${theme === 'dark' ? 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800' : 'border-gray-300 text-black hover:bg-gray-100'}`}>
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
