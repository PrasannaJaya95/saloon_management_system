import React from 'react';
import { Clock, Star, MoreHorizontal, TrendingUp } from 'lucide-react';

const Staff = () => {
    const staffMembers = [
        { id: 1, name: 'Emma Davis', role: 'Senior Stylist', status: 'On Shift', rating: 4.8, shift: '9:00 AM - 5:00 PM', avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=random', efficiency: 92 },
        { id: 2, name: 'Liam Patel', role: 'Massage Therapist', status: 'Busy', rating: 4.9, shift: '11:00 AM - 7:00 PM', avatar: 'https://ui-avatars.com/api/?name=Liam+Patel&background=random', efficiency: 88 },
        { id: 3, name: 'Sophia Kim', role: 'Nail Artist', status: 'Off Duty', rating: 4.7, shift: 'Off', avatar: 'https://ui-avatars.com/api/?name=Sophia+Kim&background=random', efficiency: 95 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white">Staff Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your team, schedules, and performance.</p>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/25 transition-all active:scale-95 flex items-center gap-2 text-white">
                    <span className="text-xl leading-none">+</span> Add Staff
                </button>
            </div>

            {/* Roster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffMembers.map(staff => (
                    <div key={staff.id} className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-gray-800 relative group hover:border-gray-700 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-6 relative">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img src={staff.avatar} alt={staff.name} className="w-16 h-16 rounded-2xl border-2 border-gray-700 group-hover:border-pink-500/50 transition-colors object-cover" />
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${staff.status === 'On Shift' ? 'bg-green-500' :
                                        staff.status === 'Busy' ? 'bg-red-500' : 'bg-gray-500'
                                        }`}></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{staff.name}</h3>
                                    <p className="text-pink-400 text-sm font-medium">{staff.role}</p>
                                </div>
                            </div>
                            <button className="text-gray-500 hover:text-white p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 relative">
                            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-gray-800/50">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">Shift</span>
                                </div>
                                <span className="text-sm font-medium text-white">{staff.shift}</span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-gray-800/50">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm">Rating</span>
                                </div>
                                <span className="text-sm font-bold text-white flex items-center gap-1">
                                    {staff.rating} <span className="text-gray-600 font-normal">/ 5.0</span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-800 relative">
                            <div className="flex justify-between text-xs text-gray-400 mb-2">
                                <span>Efficiency</span>
                                <span>{staff.efficiency}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${staff.efficiency > 90 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                    style={{ width: `${staff.efficiency}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mock KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800">
                    <h3 className="text-lg font-bold text-white mb-4">Top Performer</h3>
                    <div className="flex items-center gap-6">
                        <img src="https://ui-avatars.com/api/?name=Liam+Patel&background=random" className="w-20 h-20 rounded-full ring-4 ring-pink-500/20" />
                        <div>
                            <p className="text-2xl font-bold text-white">Liam Patel</p>
                            <p className="text-gray-400">Generated $1,240 this week</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-3xl border border-pink-500/10 backdrop-blur-xl flex items-center justify-between">
                    <div>
                        <p className="text-pink-200 font-medium">Total Staff Costs</p>
                        <p className="text-3xl font-bold text-white mt-2">$4,200 <span className="text-sm font-normal text-gray-400">/ week</span></p>
                    </div>
                    <div className="p-4 bg-pink-500/10 rounded-2xl text-pink-400">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Staff;
