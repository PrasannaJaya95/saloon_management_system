import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Lock, Key, Camera, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    // Actually, I'll just use local state for the image preview to make it instant.
    const [previewImage, setPreviewImage] = useState(user?.avatar || null);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    // Password Change State
    const [passData, setPassData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (passData.newPassword !== passData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword: passData.currentPassword,
                    newPassword: passData.newPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Password updated successfully' });
                setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile/avatar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setPreviewImage(data.avatar);
                setMessage({ type: 'success', text: 'Profile picture updated!' });
                // Optional: Refresh global user state if methods exist, or just rely on next reload
                window.location.reload();
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Side: Navigation Card */}
                <div className="col-span-1">
                    <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 h-full">
                        <div className="flex flex-col items-center mb-8 relative">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-black border-4 border-gray-900 flex items-center justify-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 shadow-2xl mb-4 overflow-hidden">
                                    {previewImage || user?.avatar ? (
                                        <img src={previewImage || user?.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0)
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer">
                                    <Camera className="w-8 h-8" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
                                </label>
                            </div>
                            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                            <p className="text-pink-400 text-sm">{user?.role}</p>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'general' ? 'bg-white/10 text-white font-bold border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <User className="w-5 h-5" />
                                General Info
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'security' ? 'bg-white/10 text-white font-bold border border-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Lock className="w-5 h-5" />
                                Security
                            </button>
                            <div className="pt-4 border-t border-white/5 mt-4">
                                <button
                                    onClick={() => { logout(); navigate('/'); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Right Side: Content Area */}
                <div className="col-span-1 md:col-span-2">
                    <div className="bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 min-h-[400px]">

                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-xl font-bold text-white mb-6">General Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold ml-1">Full Name</label>
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-white flex items-center gap-3">
                                            <User className="text-gray-500 w-5 h-5" />
                                            {user?.name}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold ml-1">Email Address</label>
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-white flex items-center gap-3">
                                            <Mail className="text-gray-500 w-5 h-5" />
                                            {user?.email}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold ml-1">Phone Number</label>
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-white flex items-center gap-3">
                                            <Phone className="text-gray-500 w-5 h-5" />
                                            {user?.phone || 'Not provided'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold ml-1">Account Type</label>
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-white flex items-center gap-3">
                                            <Shield className="text-gray-500 w-5 h-5" />
                                            {user?.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>

                                {message && (
                                    <div className={`p-4 rounded-xl text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold ml-1">Current Password</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                                            <input
                                                type="password" required
                                                value={passData.currentPassword}
                                                onChange={e => setPassData({ ...passData, currentPassword: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-pink-500 outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold ml-1">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                                            <input
                                                type="password" required
                                                value={passData.newPassword}
                                                onChange={e => setPassData({ ...passData, newPassword: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-pink-500 outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 uppercase font-bold ml-1">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                                            <input
                                                type="password" required
                                                value={passData.confirmPassword}
                                                onChange={e => setPassData({ ...passData, confirmPassword: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-pink-500 outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="mt-4 px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-pink-500/20 transition-all disabled:opacity-50">
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
