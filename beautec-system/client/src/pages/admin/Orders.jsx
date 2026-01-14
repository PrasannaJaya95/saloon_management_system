import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, User, Search, Filter, ChevronRight, Eye } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/shop/orders');
                const data = await res.json();
                if (data.success) {
                    setOrders(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-white">Loading orders...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white">Orders & Transactions</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage and track all customer orders.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="bg-gray-800 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-pink-500/50"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-800 bg-black/20">
                            <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                            <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                            <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</th>
                            <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                            <th className="p-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {orders.map((order) => (
                            <tr key={order._id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-6 text-sm font-medium text-white/80 font-mono">#{order._id.slice(-6).toUpperCase()}</td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 flex items-center justify-center text-pink-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.source === 'POS' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {order.source || 'Website'}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'Paid'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-6 text-sm font-bold text-white">${order.totalAmount}</td>
                                <td className="p-6">
                                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No orders found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
