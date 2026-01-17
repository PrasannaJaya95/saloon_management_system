import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, Trash2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const Customers = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                // Filter only Users (Customers)
                setCustomers(data.filter(u => u.role === 'User'));
            }
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                fetchCustomers();
            } else {
                alert('Failed to delete customer');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white">Customers</h1>
                    <p className="text-gray-400 text-sm mt-1">View and manage your registered portal users.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-pink-500 w-full md:w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-400">Loading customers...</p>
                ) : filteredCustomers.length === 0 ? (
                    <p className="text-gray-400 col-span-full text-center py-10">No customers found.</p>
                ) : (
                    filteredCustomers.map(customer => (
                        <div key={customer._id} className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-6 border border-gray-800 relative group hover:border-gray-700 transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-pink-500 font-bold text-lg border border-pink-500/30">
                                        {customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{customer.name}</h3>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                                            <span className="bg-gray-800 px-2 py-0.5 rounded-md border border-gray-700">Customer</span>
                                            {customer.createdAt && (
                                                <span>Joined {format(new Date(customer.createdAt), 'MMM yyyy')}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {user && (user.role === 'SuperAdmin' || user.role === 'Admin') && (
                                    <button
                                        onClick={() => handleDeleteUser(customer._id)}
                                        className="text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Customer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-800/50">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <Mail className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm truncate">{customer.email}</span>
                                </div>
                                {customer.phone && (
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Phone className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm">{customer.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Customers;
