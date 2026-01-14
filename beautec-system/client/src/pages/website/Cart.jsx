import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, CreditCard } from 'lucide-react';

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(items);
    }, []);

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="bg-black min-h-screen pt-24 pb-12 px-6 text-white">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
                        <p className="text-gray-400 mb-6">Your cart is empty.</p>
                        <Link to="/shop" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200">
                            Browse Shop
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="bg-gray-900 p-4 rounded-xl flex items-center justify-between border border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                        <div>
                                            <h3 className="font-bold">{item.name}</h3>
                                            <p className="text-pink-400">${item.price}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(idx)} className="text-gray-500 hover:text-red-500">
                                        <Trash2 />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit">
                            <h2 className="text-xl font-bold mb-4">Summary</h2>
                            <div className="flex justify-between mb-2 text-gray-400">
                                <span>Subtotal</span>
                                <span>${total}</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl mb-6">
                                <span>Total</span>
                                <span>${total}</span>
                            </div>
                            <Link to="/checkout" className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
