import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, X, Search, Plus, Filter, Armchair, Scissors } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    // New Booking Form State
    const [step, setStep] = useState(1);
    const [services, setServices] = useState([]);
    const [chairs, setChairs] = useState([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [selectedChair, setSelectedChair] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Form Inputs
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlot, setTimeSlot] = useState('');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        fetchBookings();
        fetchMeta();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`);
            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMeta = async () => {
        try {
            // Parallel fetch
            const [sRes, cRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`),
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chairs`)
            ]);
            const sData = await sRes.json();
            const cData = await cRes.json();
            if (sData.success) setServices(sData.data);
            if (cData.success) setChairs(cData.data);
        } catch (err) { console.error(err); }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchBookings();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const toggleService = (id) => {
        setSelectedServiceIds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const selectedServicesData = services.filter(s => selectedServiceIds.includes(s._id));
    const totalDuration = selectedServicesData.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);

    const compatibleChairs = chairs.filter(chair => {
        if (!chair.isActive) return false;
        if (selectedServiceIds.length === 0) return true;
        return selectedServicesData.every(service =>
            chair.supportedServices.some(s => s._id === service._id || s === service._id)
        );
    });

    const handleDateChange = async (dateObj) => {
        setSelectedDate(dateObj);
        setTimeSlot('');
        if (dateObj && selectedChair) {
            setLoadingSlots(true);
            const dateStr = format(dateObj, 'yyyy-MM-dd');
            // Hardcoded URL to prevent Vite proxy issues
            const API_BASE = 'http://localhost:5000';
            const url = `${API_BASE}/api/bookings/available-slots?date=${dateStr}&chairId=${selectedChair._id}&duration=${totalDuration}`;

            try {
                const res = await fetch(url);
                const text = await res.text();

                if (!res.ok) {
                    throw new Error(`Server Error (${res.status}): ${text.substring(0, 100)}`);
                }

                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error('Invalid JSON response: ' + text.substring(0, 100));
                }

                if (data.success) {
                    setAvailableSlots(data.data);
                    if (data.data.length === 0) {
                        // Optional: Keep debug alert or remove if confident
                        // console.warn("No slots debug:", data.debug);
                        // alert(`No slots found...`);
                    }
                } else {
                    alert('Error: ' + (data.error || data.message));
                }
            } catch (err) {
                console.error(err);
                alert('Fetch Error: ' + err.message);
            }
            finally { setLoadingSlots(false); }
        }
    };

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                clientName,
                clientPhone,
                services: selectedServiceIds,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: timeSlot,
                chairId: selectedChair?._id
            };

            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Booking Created Successfully');
                setShowModal(false);
                fetchBookings();
                // Reset
                setStep(1); setSelectedServiceIds([]); setSelectedChair(null); setSelectedDate(null); setTimeSlot(''); setClientName(''); setClientPhone('');
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to create booking');
            }
        } catch (error) {
            console.error("Create booking failed", error);
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesFilter = filter === 'All' || b.status === filter;
        const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.clientPhone.includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    // Inline Styles for React Day Picker (Dark Mode)
    const css = `
        .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #db2777; --rdp-background-color: #3f3f46; margin: 0; }
        .rdp-day_selected:not([disabled]) { background-color: var(--rdp-accent-color); color: white; }
        .rdp-day_selected:hover:not([disabled]) { background-color: var(--rdp-accent-color); opacity: 0.8; }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #27272a; }
        .rdp-day_today { font-weight: bold; color: #db2777; }
        .rdp-nav_button { color: white; }
        .rdp-caption_label { color: white; font-weight: bold; }
        .rdp-head_cell { color: #9ca3af; font-weight: normal; font-size: 0.875rem; }
        .rdp-day { color: white; }
        .rdp-day_disabled { opacity: 0.25; }
    `;

    return (
        <div className="space-y-8 text-white">
            <style>{css}</style>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-xl">
                <div>
                    <h1 className="text-2xl font-bold">Bookings & Appointments</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage salon schedule and appointments.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/25 flex items-center gap-2 transition-all">
                        <Plus className="w-5 h-5" />
                        New Booking
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f
                                ? 'bg-white text-black'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-pink-500 outline-none"
                    />
                </div>
            </div>

            {/* Bookings List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading bookings...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-900/30 rounded-3xl border border-gray-800">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No bookings found.</p>
                    </div>
                ) : (
                    filteredBookings.map(booking => (
                        <div key={booking._id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6">

                            {/* Date Box */}
                            <div className="bg-gray-800 rounded-xl p-4 text-center min-w-[80px]">
                                <span className="block text-xs text-gray-400 uppercase font-bold">{new Date(booking.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="block text-2xl font-bold text-white">{new Date(booking.date).getDate()}</span>
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg text-white">{booking.clientName}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                            booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {booking.startTime} - {booking.endTime}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        {/* Display multiple services or single */}
                                        {booking.services && booking.services.length > 0
                                            ? booking.services.map(s => s.name).join(', ')
                                            : booking.serviceName || 'Service'}
                                    </div>
                                    <div className="text-gray-500">
                                        {booking.clientPhone}
                                    </div>
                                    {booking.chairId && (
                                        <div className="flex items-center gap-1.5 text-pink-400">
                                            <Armchair className="w-4 h-4" />
                                            {booking.chairId.name || 'Station'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                                            className="flex-1 md:flex-none px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                                            className="flex-1 md:flex-none px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Complete
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                                            className="px-3 py-2 bg-gray-800 text-gray-400 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Smart Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-2xl rounded-3xl border border-gray-700 shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">New Appointment</h2>

                        <form onSubmit={handleCreateBooking} className="space-y-6">

                            {/* 1. Services */}
                            <div>
                                <label className="text-sm text-gray-400 block mb-2 font-bold">1. Select Services</label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                                    {services.map(s => (
                                        <div
                                            key={s._id}
                                            onClick={() => toggleService(s._id)}
                                            className={`p-3 rounded-lg border text-sm cursor-pointer flex justify-between ${selectedServiceIds.includes(s._id) ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-gray-950 border-gray-800 text-gray-400'}`}
                                        >
                                            <span>{s.name}</span>
                                            <span className="text-pink-400">Rs. {s.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Station */}
                            <div>
                                <label className="text-sm text-gray-400 block mb-2 font-bold">2. Select Station</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {compatibleChairs.length > 0 ? compatibleChairs.map(c => (
                                        <div
                                            key={c._id}
                                            onClick={() => setSelectedChair(c)}
                                            className={`p-3 rounded-lg border text-sm cursor-pointer text-center ${selectedChair?._id === c._id ? 'bg-pink-600/20 border-pink-500 text-white' : 'bg-gray-950 border-gray-800 text-gray-400'}`}
                                        >
                                            {c.name}
                                        </div>
                                    )) : <div className="col-span-3 text-sm text-gray-500 italic">Select services to see available stations</div>}
                                </div>
                            </div>

                            {/* 3. Date & Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                {/* Date Input with Popup Calendar */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2 font-bold">Date</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-left focus:border-pink-500 text-white flex justify-between items-center"
                                        >
                                            <span className={selectedDate ? 'text-white' : 'text-gray-500'}>
                                                {selectedDate ? format(selectedDate, 'PPP') : 'Select Date'}
                                            </span>
                                            <CalendarIcon className="w-5 h-5 text-gray-500" />
                                        </button>

                                        {isCalendarOpen && (
                                            <div className="absolute top-full left-0 mt-2 z-50 bg-gray-900 border border-gray-700 p-4 rounded-xl shadow-2xl">
                                                <DayPicker
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={(d) => {
                                                        if (d) {
                                                            handleDateChange(d);
                                                            setIsCalendarOpen(false);
                                                        }
                                                    }}
                                                    disabled={{ before: new Date() }}
                                                    defaultMonth={selectedDate || new Date()}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Time Slot Column */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2 font-bold">Time Slot ({totalDuration} min)</label>
                                    <select
                                        disabled={!selectedDate || !selectedChair || loadingSlots}
                                        value={timeSlot}
                                        onChange={e => setTimeSlot(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500 text-white mb-2"
                                    >
                                        <option value="">Select Time</option>
                                        {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>

                                    {loadingSlots && <div className="text-xs text-blue-400 animate-pulse">Checking availability...</div>}

                                    {!selectedDate && <div className="text-xs text-gray-500 italic">Please select a date first.</div>}

                                    {selectedDate && !loadingSlots && availableSlots.length === 0 && (
                                        <div className="text-xs text-red-400">No slots available. Try another date/station.</div>
                                    )}
                                </div>
                            </div>

                            {/* 4. Client Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2 font-bold">Client Name</label>
                                    <input
                                        type="text" required
                                        value={clientName}
                                        onChange={e => setClientName(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2 font-bold">Phone</label>
                                    <input
                                        type="text" required
                                        value={clientPhone}
                                        onChange={e => setClientPhone(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedChair || !timeSlot || !clientName}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold mt-4 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
