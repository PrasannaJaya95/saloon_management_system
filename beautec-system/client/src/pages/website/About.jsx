import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { Trash2, Plus, Upload } from 'lucide-react';

const About = () => {
    const { settings } = useShop();
    const { showToast } = useToast();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const API_BASE = import.meta.env.VITE_API_URL || 'http://192.168.1.8:5000';
                const res = await fetch(`${API_BASE}/api/team`);
                const data = await res.json();
                if (data.success) {
                    setTeam(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch team:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);



    return (
        <div className="bg-transparent text-white min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6">

                {/* Header / Intro */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {settings?.aboutTitle || 'About Beautec'}
                    </h1>
                    <div className="max-w-3xl mx-auto">
                        <div className="relative mb-8 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <img
                                src={settings?.aboutImageUrl || "https://images.unsplash.com/photo-1560066984-12186d30b93c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                                alt="About Us"
                                className="w-full h-80 object-cover"
                            />
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                            {settings?.aboutText || 'Welcome to Beautec, where beauty meets technology. We offer a wide range of services tailored to your needs.'}
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="py-12 border-t border-gray-800">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Experts</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                        <p className="text-gray-400 mt-4">The talented professionals dedicated to your beauty and wellness.</p>
                    </div>

                    {/* NOTE: Staff are added via Admin Dashboard -> Staff */}

                    {loading ? (
                        <div className="text-center text-gray-500 py-12 animate-pulse">Loading team...</div>
                    ) : team.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">No experts found. Please check back later.</div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-8 px-4">
                            {team.map((member) => (
                                <div key={member._id} className="group relative w-full md:w-[280px] h-[380px] rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl bg-gray-900 border border-white/5 hover:border-pink-500/30 transition-all duration-500 hover:-translate-y-2">

                                    {/* Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={member.imageUrl}
                                            alt={member.name}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                                    </div>

                                    {/* Glass Overlay Card (Floating Style) */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{member.name}</h3>
                                        <p className="text-pink-300 text-xs font-medium uppercase tracking-widest">{member.position}</p>
                                    </div>

                                    {/* Subtle Glow */}
                                    <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] group-hover:shadow-[inset_0_0_30px_rgba(236,72,153,0.2)] transition-all duration-500 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default About;
