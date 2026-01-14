import React, { useState, useEffect } from 'react';
import { Armchair, Plus, Trash2, Edit2, Loader2, Users, Scissors } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Chairs = () => {
    const { user } = useAuth();
    const [chairs, setChairs] = useState([]);
    const [staff, setStaff] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingChair, setEditingChair] = useState(null);

    const initialFormState = {
        name: '',
        description: '',
        assignedStaff: [], // Array of IDs
        supportedServices: [], // Array of IDs
        isActive: true
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchChairs();
        fetchHelpers();
    }, []);

    const fetchChairs = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chairs`);
            const data = await res.json();
            if (data.success) {
                setChairs(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch chairs", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHelpers = async () => {
        try {
            const staffRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const servicesRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`);

            const staffData = await staffRes.json();
            const servicesData = await servicesRes.json();

            if (Array.isArray(staffData)) setStaff(staffData);
            if (servicesData.success) setServices(servicesData.data);

        } catch (error) {
            console.error("Failed to fetch helpers", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingChair
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chairs/${editingChair._id}`
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chairs`;

        const method = editingChair ? 'PUT' : 'POST';

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
                fetchChairs();
                setShowModal(false);
                setEditingChair(null);
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
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chairs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) fetchChairs();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleSelection = (id, field) => {
        setFormData(prev => {
            const current = prev[field] || [];
            if (current.includes(id)) {
                return { ...prev, [field]: current.filter(item => item !== id) };
            } else {
                return { ...prev, [field]: [...current, id] };
            }
        });
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-xl flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Chair Management</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage salon stations, assign staff, and services.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingChair(null);
                        setFormData(initialFormState);
                        setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Chair
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <Loader2 className="animate-spin text-white w-8 h-8 mx-auto" /> : chairs.map(chair => (
                    <div key={chair._id} className="bg-gray-950 border border-gray-800 p-6 rounded-3xl relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-pink-500 border border-gray-800">
                                    <Armchair className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{chair.name}</h3>
                                    <p className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                        {chair.isActive ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>

                            {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => {
                                        setEditingChair(chair); setFormData({
                                            ...chair,
                                            assignedStaff: chair.assignedStaff.map(s => s._id),
                                            supportedServices: chair.supportedServices.map(s => s._id)
                                        }); setShowModal(true);
                                    }} className="text-blue-400 hover:text-blue-300 p-2 bg-gray-900 rounded-lg">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(chair._id)} className="text-red-400 hover:text-red-300 p-2 bg-gray-900 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-gray-400 mb-6">{chair.description}</p>

                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold tracking-wider mb-2">
                                    <Users className="w-3 h-3" /> Assigned Staff
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {chair.assignedStaff && chair.assignedStaff.length > 0 ? chair.assignedStaff.map(s => (
                                        <span key={s._id} className="text-xs bg-gray-900 text-gray-300 px-2 py-1 rounded-md border border-gray-800">
                                            {s.name}
                                        </span>
                                    )) : <span className="text-gray-600 text-xs italic">No staff assigned</span>}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold tracking-wider mb-2">
                                    <Scissors className="w-3 h-3" /> Services
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {chair.supportedServices && chair.supportedServices.length > 0 ? chair.supportedServices.slice(0, 3).map(s => (
                                        <span key={s._id} className="text-xs bg-gray-900 text-gray-300 px-2 py-1 rounded-md border border-gray-800">
                                            {s.name}
                                        </span>
                                    )) : <span className="text-gray-600 text-xs italic">No services linked</span>}
                                    {chair.supportedServices && chair.supportedServices.length > 3 && (
                                        <span className="text-xs text-gray-500">+{chair.supportedServices.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-2xl rounded-3xl border border-gray-700 p-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-white">{editingChair ? 'Edit Chair' : 'New Chair'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm block mb-1">Chair Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                        placeholder="e.g. Station 1"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm block mb-1">Status</label>
                                    <select
                                        value={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none h-20 resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-gray-400 text-sm block mb-2 font-bold">Assign Staff</label>
                                    <div className="h-48 overflow-y-auto bg-gray-950 border border-gray-800 rounded-xl p-2 space-y-1">
                                        {staff.map(s => (
                                            <div
                                                key={s._id}
                                                onClick={() => toggleSelection(s._id, 'assignedStaff')}
                                                className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-sm ${formData.assignedStaff.includes(s._id) ? 'bg-pink-500/20 text-white' : 'text-gray-400 hover:bg-gray-900'}`}
                                            >
                                                {s.name}
                                                {formData.assignedStaff.includes(s._id) && <div className="w-2 h-2 rounded-full bg-pink-500"></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm block mb-2 font-bold">Supported Services</label>
                                    <div className="h-48 overflow-y-auto bg-gray-950 border border-gray-800 rounded-xl p-2 space-y-1">
                                        {services.map(s => (
                                            <div
                                                key={s._id}
                                                onClick={() => toggleSelection(s._id, 'supportedServices')}
                                                className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-sm ${formData.supportedServices.includes(s._id) ? 'bg-purple-500/20 text-white' : 'text-gray-400 hover:bg-gray-900'}`}
                                            >
                                                {s.name}
                                                {formData.supportedServices.includes(s._id) && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-xl text-white font-bold">Save Chair</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chairs;
