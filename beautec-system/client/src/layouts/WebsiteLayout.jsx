import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const WebsiteLayout = () => {
    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-pink-500/30">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <footer className="bg-gray-900 py-12 px-6 border-t border-gray-800">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">Beautec</h3>
                        <p className="text-gray-400 text-sm">Experience luxury and wellness redefined. Your personal sanctuary for beauty.</p>
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
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>123 Luxury Ave, Beverly Hills</li>
                            <li>+1 (555) 123-4567</li>
                            <li>hello@beautec.com</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
                        <div className="flex gap-4">
                            {/* Social icons placeholder */}
                            <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-800"></div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    © 2026 Beautec Salon. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default WebsiteLayout;
