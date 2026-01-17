import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('Admin'); // Default role
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigateHook = useNavigate();

    const roles = [
        { id: 'SuperAdmin', label: 'Super Admin' },
        { id: 'Admin', label: 'Admin' },
        { id: 'SalonAdmin', label: 'Salon Admin' },
        { id: 'HRAdmin', label: 'HR Admin' },
        { id: 'Manager', label: 'Manager' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await login(email, password);
        setLoading(false);

        if (res.success) {
            // 1. Check if the user is allowed in the admin portal at all
            const allowedRoles = ['SuperAdmin', 'Admin', 'SalonAdmin', 'HRAdmin', 'Manager'];

            if (!allowedRoles.includes(res.role)) {
                setError('Access Denied: You are not authorized to access the Admin Portal.');
                return;
            }

            // 2. Check if the user's actual role matches the SELECTED role
            if (res.role !== selectedRole) {
                setError(`Access Denied: You are not a ${roles.find(r => r.id === selectedRole)?.label || selectedRole}. Your role is ${res.role}.`);
                return;
            }

            // 3. Navigate if all checks pass
            navigateHook('/admin/dashboard');

        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Admin Theme Background */}
            <div className="absolute inset-0 bg-[url('/assets/admin-bg-floral.png')] bg-cover bg-center opacity-20 blur-sm mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900/90 to-black/80"></div>

            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 mb-4 shadow-lg shadow-red-500/20">
                        <ShieldAlert className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-400">Restricted Access. Staff Only.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm text-center font-bold animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Login As</label>
                        <div className="relative">
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-red-500 outline-none transition-all"
                                placeholder="admin@salonix.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-12 py-3 text-white focus:border-red-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-red-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>
                <div className="text-center pt-6">
                    <a href="/" className="text-gray-500 hover:text-white transition-colors text-sm hover:underline">
                        &larr; Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
