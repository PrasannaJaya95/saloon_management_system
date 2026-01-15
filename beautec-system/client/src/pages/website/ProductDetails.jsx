import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Minus, Plus, Search, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/products/${id}`;
            console.log('Fetching URL:', url);
            const res = await fetch(url);
            const data = await res.json();
            console.log('Fetch Response:', data);

            if (data.success) {
                setProduct(data.data);
            } else {
                console.error('Fetch failed:', data.error);
            }
        } catch (error) {
            console.error("Network/Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const { addToCart: addToCartContext } = useCart();

    const addToCart = () => {
        if (!product) return;

        addToCartContext(product, quantity);

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-24 pb-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black pt-24 pb-12 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <p className="text-gray-400 mb-6">Could not load product details.</p>
                <button onClick={() => navigate('/shop')} className="text-pink-400 hover:text-pink-300">Return to Shop</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">
                <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Shop
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl relative aspect-square group">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            {product.itemNumber && (
                                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-gray-700/50">
                                    Item #: <span className="text-pink-400">{product.itemNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div>
                            <div className="text-sm text-purple-400 font-bold tracking-wider uppercase mb-2">{product.category}</div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">{product.name}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-3xl font-bold text-pink-500">Rs. {product.price}</div>
                                {product.stock > 0 ? (
                                    <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/20">In Stock</span>
                                ) : (
                                    <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm font-medium border border-red-500/20">Out of Stock</span>
                                )}
                            </div>
                            <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="pt-8 border-t border-gray-800 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-gray-900 rounded-xl border border-gray-800">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex-1 relative">
                                    <button
                                        onClick={addToCart}
                                        disabled={product.stock <= 0}
                                        className="w-full bg-white text-black font-bold h-[50px] rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                    {showSuccess && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium py-2 rounded-lg text-center animate-in fade-in slide-in-from-top-2 flex items-center justify-center gap-2">
                                            <Check className="w-4 h-4" /> Added to Cart!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
