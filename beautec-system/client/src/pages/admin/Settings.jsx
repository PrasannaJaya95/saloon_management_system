import React, { useState, useEffect } from 'react';

import { Users, Shield, Store, Bell, Save, Upload, Loader2, Scissors, Tag, Globe, Monitor, User, Mail, Clock } from 'lucide-react';
import ServicesSettings from './ServicesSettings';
import CategoriesSettings from './CategoriesSettings';
import TeamSettings from '../../components/admin/TeamSettings';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';

const Settings = () => {
    const { user } = useAuth();
    const { refreshSettings } = useShop();
    const [activeTab, setActiveTab] = useState('general');

    // General Settings State
    const [formData, setFormData] = useState({
        salonName: '',
        address: '',
        phone: '',
        currency: '',
        heroTitle: '',
        heroSubtitle: '',
        aboutTitle: '',
        aboutText: '',
        contactTitle: '',
        contactText: '',
        contactEmail: '',
        openingHours: '',
        footerText: '',
        copyrightText: '',
        socialLinks: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: ''
        }
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Hero Background State
    const [heroBgPreviewUrl, setHeroBgPreviewUrl] = useState(null);
    const [selectedHeroBg, setSelectedHeroBg] = useState(null);

    // About Image State
    const [aboutImgPreviewUrl, setAboutImgPreviewUrl] = useState(null);
    const [selectedAboutImg, setSelectedAboutImg] = useState(null);

    // Contact Hero State
    const [contactHeroPreviewUrl, setContactHeroPreviewUrl] = useState(null);
    const [selectedContactHero, setSelectedContactHero] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null); // For success/error messages

    // Fetch Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`);
                const data = await res.json();
                if (data.success && data.data) {
                    setFormData({
                        salonName: data.data.salonName,
                        address: data.data.address,
                        phone: data.data.phone,
                        currency: data.data.currency,
                        heroTitle: data.data.heroTitle,
                        heroSubtitle: data.data.heroSubtitle,
                        aboutTitle: data.data.aboutTitle,
                        aboutText: data.data.aboutText,
                        contactTitle: data.data.contactTitle,
                        contactText: data.data.contactText,
                        contactEmail: data.data.contactEmail,
                        openingHours: data.data.openingHours,
                        footerText: data.data.footerText,
                        copyrightText: data.data.copyrightText,
                        socialLinks: data.data.socialLinks || { facebook: '', instagram: '', twitter: '', linkedin: '' }
                    });
                    if (data.data.logoUrl) {
                        setPreviewUrl(data.data.logoUrl);
                    }
                    if (data.data.heroBackgroundUrl) {
                        setHeroBgPreviewUrl(data.data.heroBackgroundUrl);
                    }
                    if (data.data.aboutImageUrl) {
                        setAboutImgPreviewUrl(data.data.aboutImageUrl);
                    }
                    if (data.data.contactHeroUrl) {
                        setContactHeroPreviewUrl(data.data.contactHeroUrl);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        };

        fetchSettings();
    }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleHeroBgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedHeroBg(file);
            setHeroBgPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAboutImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedAboutImg(file);
            setAboutImgPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleContactHeroChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedContactHero(file);
            setContactHeroPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const data = new FormData();
            data.append('salonName', formData.salonName);
            data.append('address', formData.address);
            data.append('phone', formData.phone);
            data.append('currency', formData.currency);
            data.append('heroTitle', formData.heroTitle);
            data.append('heroSubtitle', formData.heroSubtitle);
            data.append('aboutTitle', formData.aboutTitle);
            data.append('aboutText', formData.aboutText);
            data.append('contactTitle', formData.contactTitle);
            data.append('contactText', formData.contactText);
            data.append('contactEmail', formData.contactEmail);
            data.append('openingHours', formData.openingHours);
            data.append('footerText', formData.footerText);
            data.append('copyrightText', formData.copyrightText);
            data.append('socialLinks', JSON.stringify(formData.socialLinks));
            if (selectedFile) {
                data.append('logo', selectedFile);
            }
            if (selectedHeroBg) {
                data.append('heroBackground', selectedHeroBg);
            }
            if (selectedAboutImg) {
                data.append('aboutImage', selectedAboutImg);
            }
            if (selectedContactHero) {
                data.append('contactHero', selectedContactHero);
            }

            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const result = await res.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
                // Update local state and global context
                if (result.data.logoUrl) {
                    setPreviewUrl(result.data.logoUrl);
                }
                if (result.data.heroBackgroundUrl) {
                    setHeroBgPreviewUrl(result.data.heroBackgroundUrl);
                }
                if (result.data.aboutImageUrl) {
                    setAboutImgPreviewUrl(result.data.aboutImageUrl);
                }
                if (result.data.contactHeroUrl) {
                    setContactHeroPreviewUrl(result.data.contactHeroUrl);
                }
                await refreshSettings(); // Update global context (Sidebar/Navbar)
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
            }
        } catch (error) {
            console.error("Update failed:", error);
            setMessage({ type: 'error', text: 'An error occurred while saving.' });
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Store },
        { id: 'website', label: 'Web Customization', icon: Globe },
        { id: 'services', label: 'Services', icon: Scissors },
        { id: 'categories', label: 'Categories', icon: Tag },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ];

    // Filter tabs for non-admins
    const isAdmin = user?.role === 'SuperAdmin' || user?.role === 'Admin';
    const visibleTabs = isAdmin
        ? tabs
        : tabs.filter(tab => ['security', 'notifications'].includes(tab.id));

    // Filter tabs for redirection logic
    const allowedTabs = tabs.filter(tab => {
        if (['general', 'website', 'services', 'categories'].includes(tab.id)) {
            return isAdmin;
        }
        return true;
    });

    const [activeWebTab, setActiveWebTab] = useState('home');

    return (
        <div className="space-y-8 pb-20">
            {/* Main Tabs Navigation */}
            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-xl">
                <h1 className="text-2xl font-bold text-white">System Settings</h1>
                <p className="text-gray-400 text-sm mt-1">Configure your salon, manage staff, services, and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {visibleTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-gray-900/50 backdrop-blur-md rounded-3xl border border-gray-800 p-8 min-h-[500px]">

                    {/* TEAM TAB */}
                    {activeTab === 'team' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <TeamSettings />
                        </div>
                    )}

                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <div className="max-w-xl animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <h2 className="text-xl font-bold text-white mb-6">General Information</h2>

                            {message && (
                                <div className={`p-4 rounded-xl mb-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {message.text}
                                </div>
                            )}

                            {/* Logo Upload */}
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden relative group">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-gray-500">Logo</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="text-white w-6 h-6" />
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        disabled={user?.role !== 'SuperAdmin' && user?.role !== 'Admin'}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Company Logo</h3>
                                    <p className="text-sm text-gray-500">Upload your brand logo (PNG, JPG)</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Salon Name</label>
                                    <input
                                        type="text"
                                        value={formData.salonName}
                                        onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                        readOnly={user?.role !== 'SuperAdmin' && user?.role !== 'Admin'}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Address</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                        readOnly={user?.role !== 'SuperAdmin' && user?.role !== 'Admin'}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Phone</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                            readOnly={user?.role !== 'SuperAdmin' && user?.role !== 'Admin'}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Currency</label>
                                        <input
                                            type="text"
                                            value={formData.currency}
                                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                            readOnly={user?.role !== 'SuperAdmin' && user?.role !== 'Admin'}
                                        />
                                    </div>
                                </div>
                            </div>

                            {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                                <div className="pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* WEB CUSTOMIZATION TAB */}
                    {activeTab === 'website' && (
                        <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <h2 className="text-xl font-bold text-white mb-6">Web Customization</h2>

                            {/* Sub-Navigation for Web Customization */}
                            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-1">
                                {[
                                    { id: 'home', label: 'Home Page' },
                                    { id: 'about', label: 'About Us' },
                                    { id: 'contact', label: 'Contact Us' },
                                    { id: 'footer', label: 'Footer' }
                                ].map((subTab) => (
                                    <button
                                        key={subTab.id}
                                        onClick={() => setActiveWebTab(subTab.id)}
                                        className={`px-4 py-2 rounded-t-lg transition-colors text-sm font-medium ${activeWebTab === subTab.id
                                            ? 'text-pink-500 border-b-2 border-pink-500 bg-pink-500/5'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {subTab.label}
                                    </button>
                                ))}
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl mb-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {message.text}
                                </div>
                            )}

                            {/* Home Page Content */}
                            {activeWebTab === 'home' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <h3 className="text-lg font-semibold text-pink-400 border-b border-gray-800 pb-2 mb-4">Hero Section Defaults</h3>

                                    {/* Hero Background Upload */}
                                    <div className="mb-6">
                                        <label className="text-sm text-gray-400 block mb-2">Background Image Upload</label>
                                        <div className="w-full h-48 rounded-2xl bg-gray-950 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden relative group">
                                            {heroBgPreviewUrl ? (
                                                <img src={heroBgPreviewUrl} alt="Hero Background" className="w-full h-full object-cover opacity-80" />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Upload className="text-gray-500 w-8 h-8 mb-2" />
                                                    <span className="text-gray-500">Upload Background Image</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="text-white w-8 h-8" />
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleHeroBgChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Recommended: 1920x1080px (Landscape)</p>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Hero Title</label>
                                        <input
                                            type="text"
                                            value={formData.heroTitle}
                                            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                            placeholder="Experience Luxury..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Hero Subtitle</label>
                                        <textarea
                                            value={formData.heroSubtitle}
                                            onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 h-24 resize-none"
                                            placeholder="Your sanctuary for..."
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Home Settings
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* About Us Content */}
                            {activeWebTab === 'about' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <h3 className="text-lg font-semibold text-pink-400 border-b border-gray-800 pb-2 mb-4">About Content Defaults</h3>
                                    {/* About Image Upload */}
                                    <div className="mb-6">
                                        <label className="text-sm text-gray-400 block mb-2">About Section Image</label>
                                        <div className="w-full h-48 rounded-2xl bg-gray-950 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden relative group">
                                            {aboutImgPreviewUrl ? (
                                                <img src={aboutImgPreviewUrl} alt="About Image" className="w-full h-full object-cover opacity-80" />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Upload className="text-gray-500 w-8 h-8 mb-2" />
                                                    <span className="text-gray-500">Upload About Image</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload className="text-white w-8 h-8" />
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAboutImgChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Recommended: Square or Portrait (800x800px)</p>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">About Title</label>
                                        <input
                                            type="text"
                                            value={formData.aboutTitle}
                                            onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                            placeholder="About Beautec"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">About Text</label>
                                        <textarea
                                            value={formData.aboutText}
                                            onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                                            rows={4}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                                            placeholder="Welcome to Beautec..."
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center gap-2"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save About Settings
                                        </button>
                                    </div>

                                    <div className="border-t border-gray-800 pt-8 mt-8">
                                        <TeamSettings />
                                    </div>
                                </div>
                            )}

                            {/* Contact Us Content */}
                            {activeWebTab === 'contact' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <h3 className="text-lg font-semibold text-pink-400 border-b border-gray-800 pb-2 mb-4">Contact Page Defaults</h3>

                                    <div className="space-y-4">
                                        {/* Contact Hero Upload */}
                                        <div className="mb-6">
                                            <label className="text-sm text-gray-400 block mb-2">Contact Hero Image</label>
                                            <div className="w-full h-48 rounded-2xl bg-gray-950 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden relative group">
                                                {contactHeroPreviewUrl ? (
                                                    <img src={contactHeroPreviewUrl} alt="Contact Hero" className="w-full h-full object-cover opacity-80" />
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <Upload className="text-gray-500 w-8 h-8 mb-2" />
                                                        <span className="text-gray-500">Upload Hero Image</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload className="text-white w-8 h-8" />
                                                </div>
                                                <input type="file" accept="image/*" onChange={handleContactHeroChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">Recommended: 1920x600px (Panoramic)</p>
                                        </div>

                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Page Title</label>
                                            <input type="text" value={formData.contactTitle || ''} onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500" placeholder="Get in Touch" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Page Subtitle</label>
                                            <textarea value={formData.contactText || ''} onChange={(e) => setFormData({ ...formData, contactText: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 h-20 resize-none" placeholder="We'd love to hear from you." />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Contact Email</label>
                                            <input type="email" value={formData.contactEmail || ''} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500" placeholder="hello@beautec.com" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Opening Hours (Display Text)</label>
                                            <textarea value={formData.openingHours || ''} onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 h-24" placeholder="Mon-Fri: 9am-8pm..." />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Location / Address</label>
                                                <input
                                                    type="text"
                                                    value={formData.address || ''}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                                    placeholder="123 Fashion Street, Colombo"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.phone || ''}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                                    placeholder="+94 77 123 4567"
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center gap-2">
                                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Save Contact Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Footer Content */}
                            {activeWebTab === 'footer' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <h3 className="text-lg font-semibold text-pink-400 border-b border-gray-800 pb-2 mb-4">Footer Settings</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Footer Description</label>
                                            <textarea
                                                value={formData.footerText || ''}
                                                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 h-24"
                                                placeholder="Brief description about the salon..."
                                            />
                                        </div>

                                        <h4 className="text-md font-medium text-white pt-2">Social Media Links</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Facebook URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.socialLinks?.facebook || ''}
                                                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                                    placeholder="https://facebook.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Instagram URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.socialLinks?.instagram || ''}
                                                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                                    placeholder="https://instagram.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">Twitter (X) URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.socialLinks?.twitter || ''}
                                                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                                    placeholder="https://twitter.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-1">LinkedIn URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.socialLinks?.linkedin || ''}
                                                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                                    placeholder="https://linkedin.com/..."
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm text-gray-400 block mb-1">Copyright Text</label>
                                            <input
                                                type="text"
                                                value={formData.copyrightText || ''}
                                                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                                placeholder="© 2024 Beautec. All rights reserved."
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all active:scale-95 flex items-center gap-2">
                                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Save Footer Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SERVICES TAB */}
                    {activeTab === 'services' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <ServicesSettings />
                        </div>
                    )}

                    {/* CATEGORIES TAB */}
                    {activeTab === 'categories' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <CategoriesSettings />
                        </div>
                    )}

                    {/* SECURITY TAB (Mock) */}
                    {activeTab === 'security' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-white mb-6">Security Preferences</h2>
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-500 text-sm mb-6">
                                Advanced security settings are managed by Super Admin.
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-950 rounded-xl border border-gray-800">
                                    <div>
                                        <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                                        <p className="text-xs text-gray-500">Require 2FA for all admin logins</p>
                                    </div>
                                    <div className="w-12 h-6 bg-gray-800 rounded-full relative"><div className="w-4 h-4 bg-gray-600 rounded-full absolute left-1 top-1"></div></div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-950 rounded-xl border border-gray-800">
                                    <div>
                                        <h3 className="text-white font-medium">Session Timeout</h3>
                                        <p className="text-xs text-gray-500">Auto-logout after 30 minutes</p>
                                    </div>
                                    <div className="w-12 h-6 bg-pink-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS TAB (Mock) */}
                    {activeTab === 'notifications' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold text-white mb-6">Notification Settings</h2>
                            <p className="text-gray-400">Manage email and push notifications here.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Settings;
