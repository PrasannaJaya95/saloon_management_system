import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Star } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-black text-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black z-10"></div>
                {/* Abstract background blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-[128px]"></div>

                <div className="container mx-auto px-6 relative z-20 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Experience Luxury <br /> & Wellness
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Book your sanctuary. Rejuvenate your soul. The modern salon experience you deserve.
                    </p>
                    <Link to="/booking" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-lg font-bold hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-shadow inline-block">
                        Book an Appointment
                    </Link>
                </div>
            </section>

            {/* Services Preview */}
            <section className="py-24 bg-gray-900/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Services</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Hair & Styling', icon: Sparkles, desc: 'Cutting-edge styles by master stylists.' },
                            { title: 'Spa & Wellness', icon: Star, desc: 'Deep relaxation treatments for mind and body.' },
                            { title: 'Easy Booking', icon: Calendar, desc: 'Seamless online booking managed by Beautec.' }
                        ].map((service, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-pink-500/50 transition-colors group">
                                <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br from-purple-500 to-pink-500 transition-all">
                                    <service.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-gray-400">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
