import React, { useState, useEffect } from 'react';
import { Users, Shield, Store, Bell, Save, Upload, Loader2, Scissors, Tag } from 'lucide-react';
import Staff from './Staff';
import ServicesSettings from './ServicesSettings';
import CategoriesSettings from './CategoriesSettings';
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
        currency: ''
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
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
                        currency: data.data.currency
                    });
                    if (data.data.logoUrl) {
                        setPreviewUrl(data.data.logoUrl);
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

    const handleSave = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const data = new FormData();
            data.append('salonName', formData.salonName);
            data.append('address', formData.address);
            data.append('phone', formData.phone);
            data.append('currency', formData.currency);
            if (selectedFile) {
                data.append('logo', selectedFile);
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
        { id: 'general', label: 'General / Shop', icon: Store },
        { id: 'staff', label: 'Staff Integration', icon: Users },
        { id: 'services', label: 'Services', icon: Scissors },
        { id: 'categories', label: 'Product Categories', icon: Tag },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-xl">
                <h1 className="text-2xl font-bold text-white">System Settings</h1>
                <p className="text-gray-400 text-sm mt-1">Configure your salon, manage staff, services, and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map(tab => (
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

                    {/* STAFF TAB */}
                    {activeTab === 'staff' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <Staff isSettingsMode={true} />
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
