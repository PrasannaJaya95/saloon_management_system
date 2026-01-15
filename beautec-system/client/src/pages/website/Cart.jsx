import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const { cart: cartItems, removeFromCart, updateQuantity, cartTotal: total } = useCart();

    // Removed local loadCart logic as CartContext handles it directly.

    const removeItem = (index) => {
        // Need to get ID from item at index, context expects ID
        const item = cartItems[index];
        if (item) removeFromCart(item._id);
    };

    const handleUpdateQuantity = (index, delta) => {
        const item = cartItems[index];
        if (item) updateQuantity(item._id, item.quantity + delta);
    };

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                    <ShoppingBag className="w-10 h-10 text-pink-500" />
                    Your Cart
                </h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item, index) => (
                                <div key={index} className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl flex items-center gap-6 group hover:border-gray-700 transition-colors">
                                    <div className="w-24 h-24 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">{item.category}</div>
                                                <h3 className="text-xl font-bold">{item.name}</h3>
                                            </div>
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="text-gray-500 hover:text-red-400 transition-colors p-2"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center bg-gray-950 rounded-lg border border-gray-800">
                                                <button
                                                    onClick={() => handleUpdateQuantity(index, -1)}
                                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(index, 1)}
                                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-xl font-bold text-pink-500">
                                                Rs. {item.price * item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 sticky top-28">
                                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>Rs. {total}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="h-px bg-gray-800 my-2"></div>
                                    <div className="flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span>Rs. {total}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="w-full mt-4 text-gray-500 font-medium hover:text-white transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed">
                        <ShoppingBag className="w-20 h-20 text-gray-700 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Go ahead and explore our products.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-pink-500 transition-all hover:shadow-lg hover:shadow-pink-500/20"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
