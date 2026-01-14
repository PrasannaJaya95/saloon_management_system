import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

const Shop = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/products`)
            .then(res => res.json())
            .then(data => setProducts(data.data || []))
            .catch(err => console.error(err));
    }, []);

    const addToCart = (product) => {
        // Simple LocalStorage Cart for demo
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        currentCart.push(product);
        localStorage.setItem('cart', JSON.stringify(currentCart));
        alert(`${product.name} added to cart!`);
        window.dispatchEvent(new Event('storage')); // Notify Navbar
    };

    return (
        <div className="bg-black min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Beautec Store
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map(product => (
                        <div key={product._id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-pink-500 transition-colors group">
                            <div className="h-64 overflow-hidden">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                                    <span className="bg-pink-500/10 text-pink-400 px-2 py-1 rounded-lg text-sm font-bold">Rs. {product.price}</span>
                                </div>
                                <p className="text-gray-400 mb-6 text-sm">{product.description}</p>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shop;
