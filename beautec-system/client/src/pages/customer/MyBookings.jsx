import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MyBookings = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="p-10 rounded-3xl bg-gray-900/40 border border-white/5 text-center text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointment history found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => (
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
