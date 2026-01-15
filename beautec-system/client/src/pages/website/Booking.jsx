import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, Armchair, Scissors, ChevronRight, X } from 'lucide-react';
import { createBooking } from '../../services/api';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

const Booking = () => {
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1); // 1: Services, 2: Chair, 3: DateTime, 4: Details
    const [status, setStatus] = useState('idle');

    // Data
    const [services, setServices] = useState([]);
    const [chairs, setChairs] = useState([]);

    // Selection
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [selectedChair, setSelectedChair] = useState(null);
    const [selectedDate, setSelectedDate] = useState(); // Date object
    const [timeSlot, setTimeSlot] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Details
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://192.168.1.8:5000';
            try {
                const sRes = await fetch(`${API_BASE}/api/services`);
                const sData = await sRes.json();
                if (sData.success) {
                    setServices(sData.data);

                    // Pre-select service from URL
                    const serviceId = searchParams.get('serviceId');
                    if (serviceId) {
                        const exists = sData.data.find(s => s._id === serviceId);
                        if (exists) setSelectedServiceIds([serviceId]);
                    }
                }

                const cRes = await fetch(`${API_BASE}/api/chairs`);
                const cData = await cRes.json();
                if (cData.success) setChairs(cData.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);

    // Derived State
    const selectedServicesData = services.filter(s => selectedServiceIds.includes(s._id));
    const totalDuration = selectedServicesData.reduce((acc, curr) => acc + curr.duration, 0);
    const totalPrice = selectedServicesData.reduce((acc, curr) => acc + curr.price, 0);

    // Filter chairs that support ALL selected services
    const compatibleChairs = chairs.filter(chair => {
        if (!chair.isActive) return false;
        if (selectedServiceIds.length === 0) return true;

        return selectedServicesData.every(service =>
            // Check if chair supports this service (by ID check in array)
            chair.supportedServices.some(s => s._id === service._id || s === service._id)
        );
    });

    const toggleService = (id) => {
        setSelectedServiceIds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const fetchSlots = async (dateObj) => {
        if (!dateObj || !selectedChair) return;

        const dateStr = format(dateObj, 'yyyy-MM-dd');
        setLoadingSlots(true);
        setAvailableSlots([]);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://192.168.1.8:5000'}/api/bookings/available-slots?date=${dateStr}&chairId=${selectedChair._id}&duration=${totalDuration}`);
            const data = await res.json();
            if (data.success) {
                setAvailableSlots(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setIsCalendarOpen(false); // Close popup
        setTimeSlot('');
        if (date) fetchSlots(date);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const payload = {
                clientName,
                clientPhone,
                services: selectedServiceIds,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: timeSlot,
                chairId: selectedChair._id
            };
            const res = await createBooking(payload);
            if (res.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

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

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">
                <div className="text-center p-8 bg-gray-900 rounded-2xl border border-green-500/30">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-400 mb-6">Thank you {clientName}. We've sent a WhatsApp confirmation to {clientPhone}.</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">Book Another</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-12 px-4">
            <style>{css}</style>
            <div className="container mx-auto max-w-5xl">

                {/* Header & Steps */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Book Appointment</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
                        <span className={step >= 1 ? "text-pink-400 font-bold" : ""}>Services</span>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        <span className={step >= 2 ? "text-pink-400 font-bold" : ""}>Chair</span>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        <span className={step >= 3 ? "text-pink-400 font-bold" : ""}>Date & Time</span>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        <span className={step >= 4 ? "text-pink-400 font-bold" : ""}>Details</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Controls */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* STEP 1: SERVICES */}
                        {step === 1 && (
                            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 animate-in fade-in slide-in-from-left-4">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Scissors className="text-purple-400" /> Select Services
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {services.map(s => (
                                        <div
                                            key={s._id}
                                            onClick={() => toggleService(s._id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${selectedServiceIds.includes(s._id)
                                                ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                                                }`}
                                        >
                                            <div>
                                                <div className="font-medium">{s.name}</div>
                                                <div className="text-xs opacity-70">{s.duration} min</div>
                                            </div>
                                            <div className="font-bold text-pink-500">Rs. {s.price}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        disabled={selectedServiceIds.length === 0}
                                        onClick={() => setStep(2)}
                                        className="bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105"
                                    >Select Chair</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: CHAIR */}
                        {step === 2 && (
                            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 animate-in fade-in slide-in-from-left-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Armchair className="text-pink-400" /> Select Chair
                                    </h2>
                                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-white">Change Services</button>
                                </div>

                                {compatibleChairs.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {compatibleChairs.map(c => (
                                            <div
                                                key={c._id}
                                                onClick={() => setSelectedChair(c)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${selectedChair?._id === c._id
                                                    ? 'bg-pink-600/20 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                                                    : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                                                    }`}
                                            >
                                                <div className="font-medium">{c.name}</div>
                                                <div className="text-xs opacity-70">{c.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-8 text-gray-500">
                                        No chairs support all selected services together. Please try selecting fewer services.
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end">
                                    <button
                                        disabled={!selectedChair}
                                        onClick={() => setStep(3)}
                                        className="bg-pink-600 disabled:opacity-50 hover:bg-pink-500 text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105"
                                    >Select Date & Time</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CALENDAR & TIME (Replaced Date Input with Calendar) */}
                        {step === 3 && (
                            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 animate-in fade-in slide-in-from-left-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <CalendarIcon className="text-blue-400" /> Select Date & Time
                                    </h2>
                                    <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-white">Change Chair</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* CALENDAR */}
                                    {/* CALENDAR POPUP TRIGGER */}
                                    <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
                                        <label className="text-sm font-medium text-gray-400 mb-2 block">Select Date</label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${isCalendarOpen || selectedDate
                                                    ? 'bg-gray-900 border-blue-500 text-white'
                                                    : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <CalendarIcon className="w-5 h-5 text-blue-400" />
                                                    {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Pick a date'}
                                                </span>
                                            </button>

                                            {/* POPUP */}
                                            {isCalendarOpen && (
                                                <div className="absolute top-full left-0 mt-2 z-50 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95">
                                                    <DayPicker
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={handleDateSelect}
                                                        disabled={{ before: new Date() }}
                                                        defaultMonth={selectedDate || new Date()}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* SLOTS */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-400 mb-3">
                                            {selectedDate ? `Available Slots on ${format(selectedDate, 'MMM d, yyyy')}` : 'Select a date to see duration'}
                                        </h3>

                                        {selectedDate ? (
                                            loadingSlots ? (
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    Checking availability...
                                                </div>
                                            ) : availableSlots.length > 0 ? (
                                                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {availableSlots.map(slot => (
                                                        <button
                                                            key={slot}
                                                            onClick={() => setTimeSlot(slot)}
                                                            className={`py-2 px-1 rounded-lg text-sm font-medium transition-all ${timeSlot === slot
                                                                ? 'bg-blue-600 text-white shadow-lg scale-105'
                                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                                }`}
                                                        >
                                                            {slot}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                                    No slots available for {totalDuration} min duration. Try another date or chair.
                                                </div>
                                            )
                                        ) : (
                                            <div className="text-gray-600 text-sm italic">
                                                Please pick a date from the calendar.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        disabled={!timeSlot || !selectedDate}
                                        onClick={() => setStep(4)}
                                        className="bg-blue-600 disabled:opacity-50 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all hover:scale-105"
                                    >Final Details</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: FORM */}
                        {step === 4 && (
                            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 animate-in fade-in slide-in-from-left-4">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <User className="text-green-400" /> Your Details
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-gray-400 text-sm">Name</label>
                                        <input
                                            type="text" required
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none transition-all"
                                            value={clientName}
                                            onChange={e => setClientName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-sm">Phone</label>
                                        <input
                                            type="tel" required
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none transition-all"
                                            value={clientPhone}
                                            onChange={e => setClientPhone(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setStep(3)} className="px-4 py-3 rounded-xl text-gray-400 hover:text-white">Back</button>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
                                        >
                                            {status === 'loading' ? 'Confirming...' : 'Confirm Booking'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-3xl border border-gray-800 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>

                            {selectedServicesData.length > 0 && (
                                <div className="space-y-3 mb-6">
                                    {selectedServicesData.map(s => (
                                        <div key={s._id} className="flex justify-between text-sm">
                                            <span className="text-gray-400">{s.name}</span>
                                            <span className="text-white">Rs. {s.price}</span>
                                        </div>
                                    ))}
                                    <div className="h-px bg-gray-800 my-2"></div>
                                    <div className="flex justify-between font-medium">
                                        <span className="text-gray-300">Total Duration</span>
                                        <span className="text-white">{totalDuration} min</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span className="text-white">Total</span>
                                        <span className="text-pink-500">Rs. {totalPrice}</span>
                                    </div>
                                </div>
                            )}

                            {selectedChair && (
                                <div className="mb-4 p-3 bg-gray-950 rounded-xl border border-gray-800 flex items-center gap-3 animate-in fade-in">
                                    <Armchair className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <div className="text-sm font-bold text-white">{selectedChair.name}</div>
                                        <div className="text-xs text-gray-500">Chair</div>
                                    </div>
                                </div>
                            )}

                            {selectedDate && timeSlot && (
                                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 flex items-center gap-3 animate-in fade-in">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <div>
                                        <div className="text-sm font-bold text-white">{format(selectedDate, 'MMM d, yyyy')}</div>
                                        <div className="text-xs text-gray-500">at {timeSlot}</div>
                                    </div>
                                </div>
                            )}

                            {selectedServicesData.length === 0 && (
                                <div className="text-gray-500 text-sm text-center py-4">Select services to proceed</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
