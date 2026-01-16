import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Truck, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MyOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
<<<<<<< HEAD
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shop/orders/myorders`, {
=======
                const response = await fetch('${import.meta.env.VITE_API_URL}/api/shop/orders/myorders', {
>>>>>>> 2d82a3d91cfc6eb8e0cc660b141703aa58f5ceaa
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
    }, [token]);

    if (loading) return <div className="text-white text-center p-10">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Orders</h1>

            {orders.length === 0 ? (
                <div className="p-10 rounded-3xl bg-gray-900/40 border border-white/5 text-center text-gray-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="p-6 rounded-2xl bg-gray-900/60 backdrop-blur-md border border-white/5">
                            <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-400">Order ID: <span className="text-white font-mono">#{order._id.slice(-6).toUpperCase()}</span></p>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                                        ${order.status === 'Paid' ? 'text-green-400 bg-green-400/10 border-green-500/20' :
                                            order.status === 'Pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20' :
                                                'text-gray-400 bg-gray-800 border-gray-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-500">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{item.name}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-white">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                <p className="text-gray-400">Total Amount</p>
                                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                    Rs. {order.totalAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
