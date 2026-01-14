import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        let res;
        if (isLogin) {
            res = await login(email, password);
        } else {
            res = await register(name, email, password);
        }

        setLoading(false);
        if (res.success) {
            if (res.role === 'SuperAdmin' || res.role === 'Admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } else {
            setError(res.message);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        // Keep email/pass states for convenience or clear them? 
        // Let's clear for cleaner UX
        if (isLogin) { // Switching to Signup
            setName('');
            setPassword('');
        } else { // Switching to Login
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/30 to-transparent blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-900/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl transition-all duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-gray-400">
                        {isLogin ? 'Sign in to access your dashboard' : 'Join Beautec today'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                            <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-pink-500 outline-none transition-all"
                                    placeholder="Jane Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">{isLogin ? 'Username / Email' : 'Email Address'}</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:border-pink-500 outline-none transition-all"
                                placeholder={isLogin ? "admin" : "name@example.com"}
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
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-12 py-3 text-white focus:border-pink-500 outline-none transition-all"
                                placeholder="••••••••"
                                minLength={6}
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

                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading
                            ? (isLogin ? 'Signing In...' : 'Creating Account...')
                            : (isLogin ? 'Sign In' : 'Sign Up')
                        }
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-gray-500 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button type="button" onClick={toggleMode} className="text-pink-400 hover:text-pink-300 font-bold ml-1 transition-colors">
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
