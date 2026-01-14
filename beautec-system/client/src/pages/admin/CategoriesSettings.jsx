import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CategoriesSettings = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const initialFormState = {
        name: '',
        description: '',
        type: 'Product' // Default to Product as requested
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingCategory
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${editingCategory._id}`
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`;

        const method = editingCategory ? 'PUT' : 'POST';

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
                fetchCategories();
                setShowModal(false);
                setEditingCategory(null);
                setFormData(initialFormState);
            } else {
                alert(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Product Categories</h2>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData(initialFormState);
                        setShowModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 text-white shadow-lg shadow-purple-500/20"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? <Loader2 className="animate-spin text-white" /> : categories.map(cat => (
                    <div key={cat._id} className="bg-gray-950 border border-gray-800 p-4 rounded-xl relative group flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-white">{cat.name}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cat.type === 'Service' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                {cat.type || 'Product'}
                            </span>
                        </div>

                        {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingCategory(cat); setFormData(cat); setShowModal(true); }} className="text-blue-400 hover:text-blue-300">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(cat._id)} className="text-red-400 hover:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-md rounded-3xl border border-gray-700 p-8">
                        <h2 className="text-2xl font-bold mb-6 text-white">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Name</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                >
                                    <option value="Product">Product</option>
                                    <option value="Service">Service</option>
                                </select>
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

export default CategoriesSettings;
