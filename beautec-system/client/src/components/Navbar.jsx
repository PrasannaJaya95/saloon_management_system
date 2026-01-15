import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';

import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { settings } = useShop();
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Use Cart Context
    const { cartCount } = useCart();
    // Removed local cart count logic as it is superseded by CartContext

    // Determine Dashboard Path
    const role = user?.role?.toLowerCase() || '';
    const isCustomer = role === 'user' || role === 'customer';
    const dashboardPath = isCustomer ? '/profile' : '/admin/dashboard';

    console.log('User Role:', user?.role, 'Path:', dashboardPath);

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Shop', path: '/shop' },
        { label: 'Booking', path: '/booking' },
        { label: 'Our Services', path: '/services' },
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    {settings?.logoUrl ? (
                        <img src={settings.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
                    ) : (
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {settings?.salonName || 'Beautec'}
                        </span>
                    )}
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `text-sm font-medium transition-colors hover:text-pink-400 ${isActive ? 'text-pink-400' : 'text-gray-300'}`}
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    {/* Cart Icon */}
                    <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <Link to={dashboardPath} className="w-10 h-10 rounded-full border border-gray-700 bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 hover:border-gray-600 transition-all hover:scale-105 shadow-md shadow-pink-500/10" title="My Account">
                            <User className="w-5 h-5" />
                        </Link>
                    ) : (
                        <Link to="/login" className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-4 md:hidden">
                    <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                mobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-gray-900 border-t border-gray-800 p-6 flex flex-col gap-4 md:hidden">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-300 hover:text-pink-400 py-2 block"
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        {user ? (
                            <Link to={dashboardPath} className="text-center px-5 py-3 rounded-lg bg-gray-800 text-white font-medium border border-gray-700">
                                My Account
                            </Link>
                        ) : (
                            <Link to="/login" className="text-center px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium">
                                Login
                            </Link>
                        )}
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
