import React from 'react';
import { Users, CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
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
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Dashboard Overview</h1>
                    <p className="text-gray-400 mt-1">Welcome back, here's what's happening today.</p>
                </div>
                <div className="text-sm text-gray-500 border border-gray-800 rounded-lg px-4 py-2 bg-gray-900/50">
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
                        className={`p-6 rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-600 transition-all duration-300 group relative overflow-hidden ${stat.title === "Today's Revenue" ? 'cursor-pointer hover:bg-gray-800/80 ring-2 ring-transparent hover:ring-pink-500/50' : ''}`}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-10`}></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3.5 rounded-2xl ${stat.bg} text-white border ${stat.border} shadow-lg shadow-black/50`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.trend && (
                                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium tracking-wide">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-8 rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
                    <h3 className="text-lg font-bold text-white mb-6">Revenue Analytics</h3>

                    {/* CSS-only Mock Chart */}
                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <div key={i} className="w-full bg-gray-800 rounded-t-lg relative group h-full flex items-end">
                                <div
                                    style={{ height: `${h}%` }}
                                    className="w-full bg-gradient-to-t from-purple-900/50 to-pink-500/50 rounded-t-lg transition-all duration-500 group-hover:to-pink-400 relative"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700">
                                        Rs. {h * 100}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex gap-4 items-start group">
                                <div className="w-2 h-2 mt-2 rounded-full bg-pink-500 ring-4 ring-pink-500/10 group-hover:ring-pink-500/30 transition-all"></div>
                                <div>
                                    <p className="text-sm text-gray-200">New appointment booking #10{20 + i}</p>
                                    <p className="text-xs text-gray-500 mt-1">2 mins ago • Sarah Connor</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-4 items-start group">
                            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 ring-4 ring-blue-500/10"></div>
                            <div>
                                <p className="text-sm text-gray-200">New staff member added</p>
                                <p className="text-xs text-gray-500 mt-1">1 hour ago • Admin</p>
                            </div>
                        </div>
                    </div>
                    <button className="mt-auto w-full py-3 rounded-xl border border-gray-700 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
