import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { createBooking } from '../../services/api';

const Booking = () => {
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        service: 'Haircut & Style',
        date: '',
        time: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const services = [
        'Haircut & Style ($50)',
        'Gel Manicure ($40)',
        'Deep Tissue Massage ($80)',
        'Facial Treatment ($60)',
        'Full Body Spa ($150)'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        const res = await createBooking(formData);
        if (res.success) {
            setStatus('success');
        } else {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">
                <div className="text-center p-8 bg-gray-900 rounded-2xl border border-green-500/30">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-400 mb-6">Thank you {formData.clientName}. We've sent a WhatsApp confirmation to {formData.clientPhone}.</p>
                    <button onClick={() => setStatus('idle')} className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">Book Another</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">Book Your Appointment</h1>
                    <p className="text-gray-400">Select your preferred service and time.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Service</label>
                        <select
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none transition-colors"
                            value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        >
                            {services.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-pink-500 outline-none transition-colors scheme-dark"
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="time"
                                    required
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-pink-500 outline-none transition-colors scheme-dark"
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Your Details</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-pink-500 outline-none transition-colors mb-3"
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            />
                        </div>
                        <input
                            type="tel"
                            placeholder="Phone Number (for WhatsApp)"
                            required
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none transition-colors"
                            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Booking;
