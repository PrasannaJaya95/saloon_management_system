import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Star, Clock, Tag } from 'lucide-react';

const Services = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`);
                const data = await res.json();
                if (data.success) {
                    setServices(data.data);
                } else if (Array.isArray(data)) {
                    setServices(data);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Helper for icons
    const getIcon = (idx) => {
        const icons = [Sparkles, Star, Calendar, Tag];
        return icons[idx % icons.length];
    };

    return (
        <div className="bg-transparent text-white min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Our Exclusive Services
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Discover a world of beauty and relaxation designed just for you.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Loading services...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, idx) => {
                            const Icon = getIcon(idx);
                            return (
                                <div key={service._id} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-pink-500/50 transition-all hover:bg-gray-900 group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center group-hover:bg-gradient-to-br from-purple-500 to-pink-500 transition-all">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-2xl font-bold text-white">Rs. {service.price}</span>
                                            <span className="text-sm text-gray-500 flex items-center justify-end gap-1 mt-1">
                                                <Clock className="w-3 h-3" /> {service.duration} mins
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-400 transition-colors">
                                        {service.name}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed mb-4">
                                        {service.description || 'Experience the finest care with our premium selection of beauty services.'}
                                    </p>

                                    <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                                        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{service.category || 'Premium Service'}</span>
                                        <button
                                            onClick={() => navigate(`/booking?serviceId=${service._id}`)}
                                            className="text-sm font-semibold text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
