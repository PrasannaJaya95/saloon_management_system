import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { useShop } from '../context/ShopContext';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const WebsiteLayout = () => {
    const { settings } = useShop();

    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen text-white font-sans selection:bg-pink-500/30 relative">
            {/* Global Background - Fixed Element for Mobile Support */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/assets/admin-bg-floral.png')`,
                        backgroundColor: '#050505'
                    }}
                ></div>
                {/* Conditional Overlay */}
                <div className={`absolute inset-0 transition-all duration-500 ${isHome
                    ? 'bg-black/50 backdrop-blur-[1px]'
                    : 'bg-black/85 backdrop-blur-[8px]'
                    }`}></div>
            </div>

            {/* Content with higher z-index */}
            <div className="relative z-10">
                <Navbar />
                <main>
                    <Outlet />
                </main>
                <footer className="bg-gray-900 py-12 px-6 border-t border-gray-800">
                    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                                {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo" className="w-6 h-6 rounded object-cover" />}
                                {settings?.salonName || 'Beautec'}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {settings?.footerText || 'Experience luxury and wellness redefined. Your personal sanctuary for beauty.'}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Services</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-pink-400">Hair Styling</a></li>
                                <li><a href="#" className="hover:text-pink-400">Spa Treatments</a></li>
                                <li><a href="#" className="hover:text-pink-400">Nail Art</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Contact</h4>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-pink-500 shrink-0" />
                                    <span>{settings?.address || '123 Luxury Ave, Beverly Hills'}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-pink-500 shrink-0" />
                                    <span>{settings?.phone || '+1 (555) 123-4567'}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-pink-500 shrink-0" />
                                    <span>{settings?.contactEmail || 'hello@beautec.com'}</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
                            <div className="flex gap-4">
                                {settings?.socialLinks?.facebook && (
                                    <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                )}
                                {settings?.socialLinks?.instagram && (
                                    <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                )}
                                {settings?.socialLinks?.twitter && (
                                    <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                )}
                                {settings?.socialLinks?.linkedin && (
                                    <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                        {settings?.copyrightText || `© ${new Date().getFullYear()} ${settings?.salonName || 'Beautec Salon'}. All rights reserved.`}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WebsiteLayout;
