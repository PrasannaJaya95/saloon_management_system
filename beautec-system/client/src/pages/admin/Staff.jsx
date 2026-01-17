import React, { useState, useEffect } from 'react';
import { Clock, Star, MoreHorizontal, TrendingUp, Plus, Trash2, Shield, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Staff = (props) => {
    const { user } = useAuth(); // Logged in user info
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User',
        position: '',
        phone: '',
        permissions: [] // Array of permission strings
    });

    const availablePermissions = [
        { id: 'manage_bookings', label: 'Manage Bookings' },
        { id: 'manage_inventory', label: 'Manage Inventory' },
        { id: 'access_pos', label: 'Access POS' },
        { id: 'view_reports', label: 'View Reports' },
        { id: 'manage_staff', label: 'Manage Staff' }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                // Filter out 'User' role (Customers)
                setStaffMembers(data.filter(u => u.role !== 'User'));
            }
        } catch (error) {
            console.error("Failed to fetch staff", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                alert('User created successfully');
                setShowModal(false);
                fetchUsers();
                setFormData({ name: '', email: '', password: '', role: 'Manager', position: '', phone: '', permissions: [] });
            } else {
                alert(data.message || 'Failed to create user');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                fetchUsers();
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const togglePermission = (permId) => {
        setFormData(prev => {
            if (prev.permissions.includes(permId)) {
                return { ...prev, permissions: prev.permissions.filter(p => p !== permId) };
            } else {
                return { ...prev, permissions: [...prev.permissions, permId] };
            }
        });
    };

    return (
        <div className="space-y-4">
            {!props.isSettingsMode && (
                <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Staff Management</h1>
                        <p className="text-gray-400 text-sm mt-1">Manage your team, roles, and permissions.</p>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Team Members</h2>
                {/* Only Admin/SuperAdmin can add users */}
                <button onClick={() => setShowModal(true)} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center gap-2 text-white shadow-lg shadow-purple-500/20">
                    <Plus className="w-4 h-4" /> Add New User
                </button>
            </div>

            {/* Roster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <p className="text-gray-400">Loading staff...</p> : staffMembers.map(staff => (
                    <div key={staff._id} className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-gray-800 relative group hover:border-gray-700 transition-all duration-300">
                        <div className="flex justify-between items-start mb-6 relative">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-500 border-2 border-gray-700 object-cover">
                                        {staff.name.charAt(0)}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${staff.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                                        }`}></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{staff.name}</h3>
                                    <p className="text-pink-400 text-sm font-medium">{staff.position || staff.role}</p>
                                </div>
                            </div>

                            {user && user.role === 'SuperAdmin' && staff.role !== 'SuperAdmin' && (
                                <button onClick={() => handleDeleteUser(staff._id)} className="text-gray-500 hover:text-red-500 p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                            {user && user.role === 'Admin' && staff.role !== 'SuperAdmin' && staff.role !== 'Admin' && (
                                <button onClick={() => handleDeleteUser(staff._id)} className="text-gray-500 hover:text-red-500 p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-3 relative">
                            <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-gray-800/50">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm">Role</span>
                                </div>
                                <span className="text-sm font-medium text-white">{staff.role}</span>
                            </div>

                            {/* Permissions Badges */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {staff.permissions && staff.permissions.map(p => (
                                    <span key={p} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-md border border-gray-700">
                                        {p.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-2xl rounded-3xl border border-gray-700 shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-white">
                            <Trash2 className="rotate-45 w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-white">Create New Team Member</h2>

                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Email</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Password</label>
                                    <input
                                        type="password" required
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500 text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500 text-white"
                                    >
                                        <option value="Manager">Manager</option>
                                        <option value="SalonAdmin">Salon Admin</option>
                                        <option value="HRAdmin">HR Admin</option>
                                        {/* Only SuperAdmin can create Admin */}
                                        {user && user.role === 'SuperAdmin' && <option value="Admin">Admin (Shop Owner)</option>}
                                        <option value="Manager">Manager</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Position Title</label>
                                    <input
                                        type="text" placeholder="e.g. Senior Stylist"
                                        value={formData.position}
                                        onChange={e => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500 text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Granted Permissions</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {availablePermissions.map(perm => (
                                        <div key={perm.id}
                                            onClick={() => togglePermission(perm.id)}
                                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${formData.permissions.includes(perm.id)
                                                ? 'bg-pink-500/20 border-pink-500/50 text-white'
                                                : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600'
                                                }`}
                                        >
                                            <span className="text-sm font-medium">{perm.label}</span>
                                            {formData.permissions.includes(perm.id) && <Check className="w-4 h-4 text-pink-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold mt-4 hover:opacity-90 transition-opacity text-white">
                                Create User
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
