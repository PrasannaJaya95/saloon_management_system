import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ServicesSettings = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const initialFormState = {
        name: '',
        description: '',
        price: '',
        duration: 30,
        requiredTerminalType: 'Chair', // Default
        category: 'Hair'
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`);
            const data = await res.json();
            if (data.success) {
                setServices(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingService
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services/${editingService._id}`
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`;

        const method = editingService ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                fetchServices();
                setShowModal(false);
                setEditingService(null);
                setFormData(initialFormState);
            } else {
                alert(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData(service);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) fetchServices();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Services Management</h2>
                <button
                    onClick={() => {
                        setEditingService(null);
                        setFormData(initialFormState);
                        setShowModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 text-white shadow-lg shadow-purple-500/20"
                >
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? <Loader2 className="animate-spin text-white" /> : services.map(service => (
                    <div key={service._id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl relative group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-white">{service.name}</h3>
                                <p className="text-sm text-gray-500">{service.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-pink-500 font-bold">Rs. {service.price}</p>
                                <p className="text-xs text-gray-400">{service.duration} min</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">{service.description}</p>

                        {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(service)} className="text-blue-400 hover:text-blue-300 p-1">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(service._id)} className="text-red-400 hover:text-red-300 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-lg rounded-3xl border border-gray-700 p-8">
                        <h2 className="text-2xl font-bold mb-6 text-white">{editingService ? 'Edit Service' : 'New Service'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Service Name</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm block mb-1">Price</label>
                                    <input
                                        type="number" required
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm block mb-1">Duration (min)</label>
                                    <input
                                        type="number" required
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Category</label>
                                <input
                                    type="text" // Could be select dropdown if categories fetched
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none h-24 resize-none"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-pink-600 hover:bg-pink-500 px-6 py-2 rounded-xl text-white font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesSettings;
