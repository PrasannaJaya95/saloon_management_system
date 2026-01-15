import React from 'react';
import { Calendar, ShoppingBag, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8 text-white">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold mb-2">
                    Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">{user?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-gray-400">Here's what's happening with your beauty journey.</p>
            </div>

            {/* Stats / Membership Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Membership Status */}
                <div className="md:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-md border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Star className="w-32 h-32 text-yellow-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                                <Star className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg">Gold Member</h3>
                        </div>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Points</span>
                                <span className="font-bold text-white">450 / 1000</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[45%]"></div>
                            </div>
                            <p className="text-xs text-gray-500">550 pts to Platinum Status</p>
                        </div>
                        <button className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors">
                            View Benefits
                        </button>
                    </div>
                </div>

                {/* Quick Quick Actions */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <Link to="/booking" className="p-6 rounded-3xl bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-md border border-pink-500/30 hover:border-pink-500/60 transition-all hover:scale-[1.02] group flex flex-col justify-between">
                        <div className="p-3 bg-pink-500/20 rounded-xl w-fit mb-4 text-pink-400 group-hover:text-pink-300">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Book Appointment</h3>
                            <p className="text-sm text-gray-400">Schedule your next session</p>
                        </div>
                    </Link>

                    <Link to="/shop" className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-md border border-blue-500/30 hover:border-blue-500/60 transition-all hover:scale-[1.02] group flex flex-col justify-between">
                        <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-4 text-blue-400 group-hover:text-blue-300">
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Shop Products</h3>
                            <p className="text-sm text-gray-400">Browse premium care items</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Upcoming & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Appointments */}
                <div className="p-8 rounded-3xl bg-gray-900/40 backdrop-blur-xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Upcoming Appointments</h3>
                        <Link to="/portal/bookings" className="text-sm text-pink-400 hover:text-pink-300">View All</Link>
                    </div>

                    {/* Placeholder for fetching real data */}
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-gray-800 text-gray-400 border border-gray-700">
                                    <span className="text-xs font-bold uppercase">Oct</span>
                                    <span className="text-lg font-bold text-white">24</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Hair Spa & Style</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        <span>10:00 AM • 45 mins</span>
                                    </div>
                                </div>
                            </div>
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-500/20 text-green-400 border border-green-500/20">Confirmed</span>
                        </div>

                        <div className="text-center py-8 text-gray-500 hidden">
                            <p>No upcoming appointments</p>
                            <Link to="/booking" className="text-pink-500 hover:underline mt-2 inline-block">Book Now</Link>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="p-8 rounded-3xl bg-gray-900/40 backdrop-blur-xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Recent Orders</h3>
                        <Link to="/portal/orders" className="text-sm text-pink-400 hover:text-pink-300">View All</Link>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Order #8823</h4>
                                    <p className="text-sm text-gray-400">3 Items • $45.00</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20">Shipped</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
