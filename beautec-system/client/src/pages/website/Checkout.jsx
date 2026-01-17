import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { CreditCard, Lock } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    // Redirect if empty
    useEffect(() => {
        if (cart.length === 0) navigate('/shop');
    }, [cart, navigate]);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Retrieve customer details from form - strictly for demo:
            const formData = new FormData(e.target);
            const customerName = formData.get('name');
            const customerEmail = formData.get('email');

            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName,
                    customerEmail,
                    items: cart.map(i => ({
                        productId: i._id,
                        name: i.name,
                        quantity: 1, // simplified quantity
                        price: i.price
                    })),
                    totalAmount: total,
                    source: 'Website',
                    paymentMethod,
                    paymentReference: paymentRef
                })
            });

            const data = await res.json();

            if (data.success) {
                clearCart();
                alert('Payment Successful! Order Confirmed.');
                navigate('/');
            } else {
                alert('Order failed: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Payment processing failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-transparent min-h-screen pt-24 pb-12 px-6 text-white">
            <div className="container mx-auto max-w-2xl">
                <div className="flex items-center gap-2 mb-8 text-gray-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Secure Checkout</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <form onSubmit={handlePayment} className="space-y-6">
                        <h2 className="text-2xl font-bold">Shipping Details</h2>
                        <input type="text" name="name" placeholder="Full Name" required className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500" />
                        <input type="email" name="email" placeholder="Email Address" required className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500" />
                        <input type="text" placeholder="Address" required className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="City" required className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500" />
                            <input type="text" placeholder="ZIP Code" required className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-pink-500" />
                        </div>

                        <h2 className="text-2xl font-bold mt-8">Payment Method</h2>
                        <div className="space-y-3">
                            {/* Card Option */}
                            <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Card' ? 'bg-pink-500/10 border-pink-500' : 'bg-gray-900 border-gray-800'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} className="accent-pink-600 w-5 h-5" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold flex items-center gap-2"><CreditCard className="w-5 h-5" /> Card Payment</span>
                                            <div className="flex gap-1">
                                                <div className="w-8 h-5 bg-gray-700 rounded blur-[1px]"></div>
                                                <div className="w-8 h-5 bg-gray-700 rounded blur-[1px]"></div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Pay securely with Credit/Debit Card</p>
                                    </div>
                                </div>
                            </label>

                            {/* Bank Transfer Option */}
                            <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Bank Transfer' ? 'bg-pink-500/10 border-pink-500' : 'bg-gray-900 border-gray-800'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" checked={paymentMethod === 'Bank Transfer'} onChange={() => setPaymentMethod('Bank Transfer')} className="accent-pink-600 w-5 h-5" />
                                    <div>
                                        <span className="font-bold">Bank Transfer</span>
                                        <p className="text-xs text-gray-400 mt-1">Direct transfer to our bank account</p>
                                    </div>
                                </div>
                                {paymentMethod === 'Bank Transfer' && (
                                    <div className="mt-4 pl-8 space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-gray-800 p-3 rounded-lg text-sm text-gray-300">
                                            <p>Bank: <span className="font-bold text-white">Commercial Bank</span></p>
                                            <p>Account: <span className="font-bold text-white">8810203040</span></p>
                                            <p>Name: <span className="font-bold text-white">Salonix Salon</span></p>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter Transaction Reference ID"
                                            value={paymentRef}
                                            onChange={(e) => setPaymentRef(e.target.value)}
                                            required
                                            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:border-pink-500 outline-none"
                                        />
                                    </div>
                                )}
                            </label>

                            {/* Cash Option */}
                            <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Cash' ? 'bg-pink-500/10 border-pink-500' : 'bg-gray-900 border-gray-800'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="payment" checked={paymentMethod === 'Cash'} onChange={() => setPaymentMethod('Cash')} className="accent-pink-600 w-5 h-5" />
                                    <div>
                                        <span className="font-bold">Cash on Delivery / Pay at Salon</span>
                                        <p className="text-xs text-gray-400 mt-1">Pay when you receive items or visit us</p>
                                    </div>
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : `Pay Rs. ${total}`}
                        </button>
                    </form>

                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit">
                        <h3 className="font-bold mb-4">Order Summary</h3>
                        <div className="space-y-2 mb-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm text-gray-400">
                                    <span>{item.name}</span>
                                    <span>Rs. {item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span>Rs. {total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
