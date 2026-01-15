import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Loader2, User } from 'lucide-react';

const TeamSettings = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/team`);
            const data = await res.json();
            if (data.success) {
                setMembers(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!name || !position || !image) {
            setMessage({ type: 'error', text: 'Please fill all fields and upload an image.' });
            return;
        }

        setSubmitting(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('position', position);
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/team`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Team member added successfully!' });
                setMembers([data.data, ...members]);
                // Reset Form
                setName('');
                setPosition('');
                setImage(null);
                setPreviewUrl(null);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to add member.' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Server error.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/team/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (data.success) {
                setMembers(members.filter(m => m._id !== id));
            } else {
                alert('Failed to delete member');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h2 className="text-xl font-bold text-white mb-2">Team Management</h2>
                <p className="text-gray-400 text-sm">Add and manage your salon professionals.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            {/* Add Member Form */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-pink-400 mb-4">Add New Member</h3>
                <form onSubmit={handleAddMember} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Image Upload */}
                        <div className="bg-gray-950 border-2 border-dashed border-gray-700 rounded-xl h-40 flex items-center justify-center relative group overflow-hidden">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <Upload className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                                    <span className="text-xs text-gray-500">Upload Photo</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>

                        {/* Inputs */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                                    placeholder="e.g. Sarah Jones"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Position / Role</label>
                                <input
                                    type="text"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                                    placeholder="e.g. Senior Stylist"
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center gap-2"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Add Member
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Team List Table */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white">Current Team ({members.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-400 text-sm">
                                <th className="p-4 font-medium">Photo</th>
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Position</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">Loading team...</td>
                                </tr>
                            ) : members.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">No team members added yet.</td>
                                </tr>
                            ) : (
                                members.map((member) => (
                                    <tr key={member._id} className="group hover:bg-gray-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700">
                                                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-white font-medium">{member.name}</td>
                                        <td className="p-4 text-pink-400 text-sm">{member.position}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(member._id)}
                                                className="text-gray-500 hover:text-red-400 p-2 rounded-full hover:bg-red-400/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeamSettings;
