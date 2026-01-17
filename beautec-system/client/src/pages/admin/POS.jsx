import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, CreditCard } from 'lucide-react';

const POS = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [viewMode, setViewMode] = useState('products'); // 'products' or 'services'
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paymentRef, setPaymentRef] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchServices();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://192.168.1.8:5000'}/api/shop/products?pos=true`);
            const data = await res.json();
            if (data.success) setProducts(data.data);
        } catch (error) { console.error(error); }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://192.168.1.8:5000'}/api/services`);
            const data = await res.json();
            if (data.success) setServices(data.data);
        } catch (error) { console.error(error); }
    };

    const addToCart = (item, type) => {
        setCart([...cart, { ...item, type }]);
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Items */}
            <div className="lg:col-span-2 space-y-6">
                {/* Search & Toggle */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                        <input type="text" placeholder={`Search ${viewMode}...`} className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-pink-500 outline-none" />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700">
                        <button
                            onClick={() => setViewMode('products')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'products' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => setViewMode('services')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'services' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Services
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {viewMode === 'products' ? (
                        products.length === 0 ? <div className="text-gray-500 p-8 col-span-3 text-center">No products found.</div> :
                            products.map(product => {
                                const isOutOfStock = product.stock <= 0;
                                return (
                                    <div key={product._id}
                                        onClick={() => !isOutOfStock && addToCart(product, 'Product')}
                                        className={`relative bg-gray-800 rounded-xl overflow-hidden transition-all group border border-gray-700 
                                    ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:ring-2 hover:ring-pink-500'}`}
                                    >
                                        {/* Stock Indicators */}
                                        {isOutOfStock ? (
                                            <div className="absolute top-3 -right-10 bg-red-600 text-white text-[10px] font-bold px-8 py-1 rotate-45 shadow-md z-10 pointer-events-none">
                                                NO STOCK
                                            </div>
                                        ) : (
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-medium px-2 py-1 rounded-md z-10 shadow flex items-center gap-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 5 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                                {product.stock}
                                            </div>
                                        )}

                                        <div className="h-32 overflow-hidden bg-gray-900 relative">
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                                        </div>
                                        <div className="p-4 relative">
                                            <h3 className="font-medium text-white truncate text-sm">{product.name}</h3>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-pink-400 font-bold text-sm">Rs. {product.price}</p>
                                                {product.itemNumber && <span className="text-[10px] text-gray-500">#{product.itemNumber}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                    ) : (
                        services.length === 0 ? <div className="text-gray-500 p-8 col-span-3 text-center">No services found.</div> :
                            services.map(service => (
                                <div key={service._id} onClick={() => addToCart(service, 'Service')} className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all group border border-gray-700 relative">
                                    <div className="h-32 bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                                        {/* Scissors icon if available, imported locally? No, Lucide generic */}
                                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                            Scan/Icon
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-white truncate">{service.name}</h3>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-purple-400 font-bold">Rs. {service.price}</p>
                                            <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded-md">{service.duration}m</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
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
                            <div key={idx} className="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${item.type === 'Service' ? 'bg-purple-900 text-purple-300' : 'bg-pink-900 text-pink-300'}`}>
                                            {item.type || 'Product'}
                                        </span>
                                        <h4 className="font-medium text-white line-clamp-1">{item.name}</h4>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Rs. {item.price}</p>
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
                        <span>Rs. {total}</span>
                    </div>
                    {/* Tax Logic optional or Keep */}
                    <div className="flex justify-between font-bold text-xl text-white">
                        <span>Total Pay</span>
                        <span>Rs. {total}</span>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-2 pt-4">
                    <p className="text-gray-400 text-sm font-medium">Payment Method</p>
                    <div className="grid grid-cols-3 gap-2">
                        {['Cash', 'Card', 'Bank Transfer'].map(method => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${paymentMethod === method
                                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent'
                                    : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'
                                    }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reference Input for Non-Cash */}
                {(paymentMethod === 'Card' || paymentMethod === 'Bank Transfer') && (
                    <div className="space-y-1">
                        <input
                            type="text"
                            value={paymentRef}
                            onChange={(e) => setPaymentRef(e.target.value)}
                            placeholder="Enter Ref #"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-pink-500 outline-none"
                        />
                    </div>
                )}

                <button
                    onClick={async () => {
                        if (cart.length === 0) return alert('Cart is empty');
                        try {
                            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/orders`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    customerName: 'Walk-in Customer',
                                    customerEmail: 'walkin@salonix.local',
                                    items: cart.map(i => ({
                                        productId: i.type === 'Product' ? i._id : undefined,
                                        serviceId: i.type === 'Service' ? i._id : undefined,
                                        type: i.type || 'Product',
                                        name: i.name,
                                        quantity: 1,
                                        price: i.price
                                    })),
                                    totalAmount: total,
                                    source: 'POS',
                                    paymentMethod,
                                    paymentReference: paymentRef
                                })
                            });
                            const data = await res.json();
                            if (data.success) {
                                alert('Payment Processed Successfully!');
                                setCart([]);
                            } else {
                                alert('Error: ' + data.error);
                            }
                        } catch (err) {
                            console.error(err);
                            alert('Failed to process order');
                        }
                    }}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity text-white shadow-lg"
                >
                    Process Payment (Rs. {total})
                </button>
            </div>
        </div>
    );
};

export default POS;
