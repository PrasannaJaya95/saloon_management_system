import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, X, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

const Shop = () => {
    const navigate = useNavigate();
    const [addedProductId, setAddedProductId] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filters State
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: ''
    });

    // Debounce Search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [debouncedSearch, filters.category, filters.minPrice, filters.maxPrice]);


    const fetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
            const data = await res.json();
            if (data.success) setCategories(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (debouncedSearch) queryParams.append('search', debouncedSearch);
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

            const queryString = queryParams.toString();
            console.log('Fetching Products with Params:', queryString);

            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/products?${queryString}`);
            const data = await res.json();
            if (data.success) setProducts(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            minPrice: '',
            maxPrice: ''
        });
    };

    const { addToCart: addToCartContext } = useCart();

    const addToCart = (product) => {
        addToCartContext(product, 1);
        setAddedProductId(product._id);
        setTimeout(() => setAddedProductId(null), 2000);
    };

    return (
        <div className="bg-transparent text-white min-h-screen pt-24 pb-12 px-4 md:px-8">
            <div className="container mx-auto">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Salonix Store
                        </h1>
                        <p className="text-gray-400">Discover premium beauty products.</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                        <div className="relative flex-1 md:w-80">
                            <input
                                type="text"
                                placeholder="Search products or Item #..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-pink-500 outline-none"
                            />
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                        </div>
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="md:hidden bg-gray-900 border border-gray-800 p-3 rounded-xl text-white"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden md:block w-64 space-y-8 flex-shrink-0">
                        {/* Categories */}
                        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                            <h3 className="font-bold text-white mb-4">Categories</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleFilterChange('category', '')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-pink-600/20 text-pink-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                >
                                    All Categories
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleFilterChange('category', cat._id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat._id ? 'bg-pink-600/20 text-pink-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                            <h3 className="font-bold text-white mb-4">Price Range</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Min Price (Rs.)</label>
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-pink-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Max Price (Rs.)</label>
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-pink-500 outline-none"
                                        placeholder="10000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(filters.category || filters.minPrice || filters.maxPrice || filters.search) && (
                            <button
                                onClick={clearFilters}
                                className="w-full py-2 text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" /> Clear All Filters
                            </button>
                        )}
                    </div>

                    {/* Mobile Filter Sheet */}
                    {isMobileFilterOpen && (
                        <div className="fixed inset-0 z-50 flex justify-end">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
                            <div className="relative w-80 bg-gray-900 h-full p-6 shadow-xl border-l border-gray-800 overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-white">Filters</h2>
                                    <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-400 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Mobile Filter Content (Duplicate of Sidebar) */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="font-bold text-white mb-4">Categories</h3>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => { handleFilterChange('category', ''); setIsMobileFilterOpen(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-pink-600/20 text-pink-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                            >
                                                All Categories
                                            </button>
                                            {categories.map(cat => (
                                                <button
                                                    key={cat._id}
                                                    onClick={() => { handleFilterChange('category', cat._id); setIsMobileFilterOpen(false); }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === cat._id ? 'bg-pink-600/20 text-pink-400 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-4">Price Range</h3>
                                        <div className="space-y-4">
                                            <input
                                                type="number"
                                                value={filters.minPrice}
                                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-pink-500 outline-none"
                                                placeholder="Min Price (Rs.)"
                                            />
                                            <input
                                                type="number"
                                                value={filters.maxPrice}
                                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-pink-500 outline-none"
                                                placeholder="Max Price (Rs.)"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin text-pink-500">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => {
                                    const isOutOfStock = product.stock <= 0;

                                    return (
                                        <div key={product._id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-pink-500 transition-all duration-300 group hover:shadow-2xl hover:shadow-pink-500/10 flex flex-col relative">

                                            {/* Stock Indicators */}
                                            {isOutOfStock ? (
                                                <div className="absolute top-4 -right-12 bg-red-600 text-white text-xs font-bold px-10 py-1 rotate-45 shadow-lg z-20 pointer-events-none tracking-wider">
                                                    OUT OF STOCK
                                                </div>
                                            ) : (
                                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full z-20 shadow-xl flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                                    {product.stock} Qty
                                                </div>
                                            )}

                                            <div
                                                onClick={() => navigate(`/shop/product/${product._id}`)}
                                                className="h-64 overflow-hidden relative cursor-pointer"
                                            >
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className={`w-full h-full object-cover transition-transform duration-700 ${isOutOfStock ? 'grayscale opacity-60' : 'group-hover:scale-110'}`}
                                                />
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>

                                                {product.itemNumber && (
                                                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-gray-300 text-[10px] px-2 py-1 rounded-md font-mono border border-white/5">
                                                        #{product.itemNumber}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5 flex flex-col flex-1 relative">
                                                <div className="mb-2 flex-1">
                                                    <div className="text-xs text-purple-400 font-medium mb-1 uppercase tracking-wider">{product.category}</div>
                                                    <h3
                                                        onClick={() => navigate(`/shop/product/${product._id}`)}
                                                        className="text-lg font-bold text-white leading-tight cursor-pointer hover:text-pink-400 transition-colors line-clamp-2"
                                                    >
                                                        {product.name}
                                                    </h3>
                                                </div>

                                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800/50">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 font-medium">Price</span>
                                                        <span className="text-xl font-bold text-white">Rs. {product.price}</span>
                                                    </div>

                                                    <button
                                                        onClick={() => !isOutOfStock && addToCart(product)}
                                                        disabled={isOutOfStock}
                                                        className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center
                                                        ${isOutOfStock
                                                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                                                : 'bg-white text-black hover:bg-pink-500 hover:text-white shadow-lg hover:shadow-pink-500/25'
                                                            }`}
                                                    >
                                                        <ShoppingCart className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {addedProductId === product._id && (
                                                    <div className="absolute top-0 left-0 right-0 flex justify-center -mt-8 pointer-events-none">
                                                        <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                                                            Added to Cart!
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed">
                                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                                <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
                                <button onClick={clearFilters} className="text-pink-400 hover:text-pink-300 font-medium">Clear all filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
