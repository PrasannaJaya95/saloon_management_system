import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const Contact = () => {
    const { settings } = useShop();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for form submission logic
        alert("Thanks for your message! We'll get back to you soon.");
    };

    return (
        <div className="bg-transparent text-white min-h-screen pt-24 pb-12">

            {/* Hero Section */}
            <div className="relative h-[40vh] flex items-center justify-center overflow-hidden mb-16">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black z-10"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url('${settings?.contactHeroUrl || "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}')` }}
                ></div>
                <div className="relative z-20 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {settings?.contactTitle || 'Get in Touch'}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto whitespace-pre-line">
                        {settings?.contactText || "We'd love to hear from you. Book an appointment or just say hello."}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-8"></div>
                            <p className="text-gray-400 text-lg mb-8">
                                Have a question or want to book a VIP session? Reach out to us through any of these channels.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-purple-900/30 transition-colors border border-gray-800 group-hover:border-purple-500/50">
                                    <MapPin className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                                    <p className="text-gray-400">{settings?.address || '123 Beauty Lane, Colombo 07, Sri Lanka'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-purple-900/30 transition-colors border border-gray-800 group-hover:border-purple-500/50">
                                    <Phone className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                                    <p className="text-gray-400">{settings?.phone || '+94 77 123 4567'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-purple-900/30 transition-colors border border-gray-800 group-hover:border-purple-500/50">
                                    <Mail className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                                    <p className="text-gray-400">{settings?.contactEmail || 'hello@salonix.com'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-purple-900/30 transition-colors border border-gray-800 group-hover:border-purple-500/50">
                                    <Clock className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
                                    <p className="text-gray-400 whitespace-pre-line">{settings?.openingHours || 'Mon - Sat: 9:00 AM - 8:00 PM\nSun: 10:00 AM - 6:00 PM'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-900/30 p-8 md:p-10 rounded-3xl border border-gray-800">
                        <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                                <input type="text" placeholder="Consultation Inquiry" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea rows="4" placeholder="How can we help you?" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600" required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" />
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>

                {/* Map Section */}
                <div className="mt-20">
                    <div className="rounded-3xl overflow-hidden border border-gray-800 h-96 relative grayscale hover:grayscale-0 transition-all duration-700">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.56436561148!2d79.81363654499692!3d6.921922572004245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1715424536789!5m2!1sen!2slk"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <div className="absolute inset-0 pointer-events-none bg-black/10"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;
