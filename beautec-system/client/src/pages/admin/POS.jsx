import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, CreditCard } from 'lucide-react';

const POS = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/shop/products?pos=true');
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Grid */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                        <input type="text" placeholder="Search services or products..." className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-pink-500 outline-none" />
                    </div>
                    <button className="bg-gray-800 px-4 rounded-xl border border-gray-700 text-gray-300">Filter</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.length === 0 ? <div className="text-gray-500 p-8">No products available in POS.</div> : products.map(product => (
                        <div key={product._id} onClick={() => addToCart(product)} className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-pink-500 transition-all group">
                            <div className="h-32 overflow-hidden">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-medium text-white truncate">{product.name}</h3>
                                <p className="text-pink-400 font-bold mt-1">${product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Panel */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col h-[600px]">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-pink-500" />
                    Current Bill
                </h2>

                <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20">Cart is empty</div>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-medium text-white">{item.name}</h4>
                                    <p className="text-sm text-gray-500">${item.price}</p>
                                </div>
                                <button onClick={() => removeFromCart(idx)} className="p-2 text-gray-500 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-4 border-t border-gray-700 pt-6">
                    <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Tax (10%)</span>
                        <span>${(total * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-white">
                        <span>Total</span>
                        <span>${(total * 1.1).toFixed(2)}</span>
                    </div>

                    <button
                        onClick={async () => {
                            if (cart.length === 0) return alert('Cart is empty');
                            try {
                                const res = await fetch('http://localhost:5000/api/shop/orders', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        customerName: 'Walk-in Customer',
                                        customerEmail: 'walkin@beautec.local',
                                        items: cart.map(i => ({
                                            productId: i._id,
                                            name: i.name,
                                            quantity: 1,
                                            price: i.price
                                        })),
                                        totalAmount: total * 1.1,
                                        source: 'POS'
                                    })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    alert('Order processed successfully!');
                                    setCart([]);
                                }
                            } catch (err) {
                                console.error(err);
                                alert('Failed to process order');
                            }
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
                    >
                        Process Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default POS;
