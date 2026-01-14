import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(items);
        if (items.length === 0) navigate('/shop');
    }, [navigate]);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Retrieve customer details from form - strictly for demo:
            const formData = new FormData(e.target);
            const customerName = formData.get('name');
            const customerEmail = formData.get('email');

            const res = await fetch('http://localhost:5000/api/shop/orders', {
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
                    source: 'Website'
                })
            });

            const data = await res.json();

            if (data.success) {
                localStorage.removeItem('cart');
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
        <div className="bg-black min-h-screen pt-24 pb-12 px-6 text-white">
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

                        <h2 className="text-2xl font-bold mt-8">Payment</h2>
                        <div className="p-4 border border-pink-500/30 bg-pink-500/5 rounded-xl flex items-center gap-3">
                            <CreditCard className="text-pink-500" />
                            <div>
                                <p className="font-bold">Mock Payment Gateway</p>
                                <p className="text-xs text-gray-400">Cards, UPI, or Wallet</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : `Pay $${total}`}
                        </button>
                    </form>

                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit">
                        <h3 className="font-bold mb-4">Order Summary</h3>
                        <div className="space-y-2 mb-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm text-gray-400">
                                    <span>{item.name}</span>
                                    <span>${item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-700 pt-4 flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
