import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MyBookings = () => {
    const { user } = useAuth();
    const token = user?.token;
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch bookings');

                const data = await response.json();
                setBookings(data);
            } catch (err) {
                setError(err.message);
                // Mock data for display if API fails (or for demo)
                // setBookings([]); 
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchBookings();
    }, [token]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'Completed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    if (loading) return <div className="text-white text-center p-10">Loading your bookings...</div>;

    const filteredBookings = bookings.filter(booking => {
        // Status Filter
        let matchStatus = true;
        if (filterStatus !== 'All') {
            if (filterStatus === 'Upcoming') matchStatus = ['Confirmed', 'Pending'].includes(booking.status);
            else matchStatus = booking.status === filterStatus;
        }

        // Date Filter
        let matchDate = true;
        if (filterDate) {
            // booking.date is likely YYYY-MM-DD string or ISO. Normalize to YYYY-MM-DD.
            const bDate = new Date(booking.date).toISOString().split('T')[0];
            matchDate = bDate === filterDate;
        }

        return matchStatus && matchDate;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <h1 className="text-3xl font-bold text-white">My Bookings</h1>
                <Link to="/booking" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    New Booking
                </Link>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">

                    {/* Date Filter */}
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-pink-500 transition-all custom-date-input w-full md:w-auto"
                    />

                    {/* Status Filter */}
                    <div className="flex bg-gray-900/60 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto no-scrollbar">
                        {['All', 'Upcoming', 'Completed', 'Cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterStatus === status
                                    ? 'bg-pink-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="p-10 rounded-3xl bg-gray-900/40 border border-white/5 text-center text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No {filterStatus === 'All' ? 'appointment history' : `${filterStatus.toLowerCase()} appointments`} found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredBookings.map((booking) => (
                        <div key={booking._id} className="p-6 rounded-2xl bg-gray-900/60 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gray-800 flex flex-col items-center justify-center border border-gray-700">
                                        <span className="text-xs font-bold text-gray-400 uppercase">{new Date(booking.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-2xl font-bold text-white">{new Date(booking.date).getDate()}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            {booking.services?.[0]?.name || 'Salon Appointment'}
                                            {booking.services?.length > 1 && ` + ${booking.services.length - 1} more`}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{booking.startTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>Station {booking.chairId?.number || '1'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Total</p>
                                        <p className="text-xl font-bold text-white">Rs. {booking.totalPrice?.toLocaleString()}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
