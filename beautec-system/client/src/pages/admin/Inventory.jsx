import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, Eye, EyeOff, X, Save, Image as ImageIcon, FolderPlus } from 'lucide-react';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    // Product Form State
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        itemNumber: '', name: '', category: '', price: '', stock: '', description: '', showInWebsite: true, showInPOS: true, relatedProducts: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Category Form State
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/products?admin=true`);
            const data = await res.json();
            if (data.success) setProducts(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
            const data = await res.json();
            if (data.success) setCategories(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenProductModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                itemNumber: product.itemNumber || '',
                name: product.name,
                category: product.categoryId || '', // Use ID for selection
                price: product.price,
                stock: product.stock,
                description: product.description,
                showInWebsite: product.showInWebsite,
                showInPOS: product.showInPOS,
                relatedProducts: product.relatedProducts || []
            });
            setImagePreview(product.imageUrl);
            setImageFile(null);
        } else {
            setEditingProduct(null);
            setFormData({ itemNumber: '', name: '', category: '', price: '', stock: '', description: '', showInWebsite: true, showInPOS: true, relatedProducts: [] });
            setImagePreview(null);
            setImageFile(null);
        }
        setIsProductModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingProduct
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/products/${editingProduct._id}`
                : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/shop/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const data = new FormData();
            data.append('itemNumber', formData.itemNumber);
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('price', formData.price);
            data.append('stock', formData.stock);
            data.append('description', formData.description);
            data.append('showInWebsite', formData.showInWebsite);
            data.append('showInPOS', formData.showInPOS);
            if (imageFile) {
                data.append('image', imageFile);
            }
            if (formData.relatedProducts) {
                data.append('relatedProducts', JSON.stringify(formData.relatedProducts));
            }

            const res = await fetch(url, {
                method: method,
                body: data
            });

            if (res.ok) {
                fetchProducts();
                setIsProductModalOpen(false);
                setEditingProduct(null); // Reset editing state
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving product');
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategory)
            });
            if (res.ok) {
                fetchCategories();
                setNewCategory({ name: '', description: '' });
                setIsCategoryModalOpen(false);
            } else {
                alert('Failed to create category');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-white relative p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
                    <p className="text-gray-400">Manage products, stock, and categories.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setIsCategoryModalOpen(true)} className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-700 flex items-center gap-2 transition-all">
                        <FolderPlus className="w-5 h-5 text-gray-400" />
                        New Category
                    </button>
                    <button onClick={() => handleOpenProductModal()} className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/20 flex items-center gap-2 transition-all">
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-950/50 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-6 font-semibold">Product</th>
                                <th className="p-6 font-semibold">Item #</th>
                                <th className="p-6 font-semibold">Category</th>
                                <th className="p-6 font-semibold">Price</th>
                                <th className="p-6 font-semibold">Stock</th>
                                <th className="p-6 font-semibold">Status</th>
                                <th className="p-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {products.map(product => (
                                <tr key={product._id} className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 border border-gray-700 relative">
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                        <ImageIcon className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg">{product.name}</div>
                                                <div className="text-sm text-gray-500 max-w-[200px] truncate">{product.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm border border-gray-700 min-w-[80px] text-center inline-block">
                                            {product.itemNumber || '-'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm border border-gray-700">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-6 font-bold text-pink-400 text-lg">Rs. {product.price}</td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${product.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                            <span className="font-medium">{product.stock} units</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-2">
                                            {product.showInWebsite && (
                                                <div className="flex items-center gap-2 text-xs text-green-400">
                                                    <Eye className="w-3 h-3" /> Website
                                                </div>
                                            )}
                                            {product.showInPOS && (
                                                <div className="flex items-center gap-2 text-xs text-blue-400">
                                                    <Package className="w-3 h-3" /> POS
                                                </div>
                                            )}
                                            {!product.showInWebsite && !product.showInPOS && (
                                                <span className="text-gray-500 text-xs italic">Hidden</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button onClick={() => handleOpenProductModal(product)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-3xl rounded-3xl border border-gray-700 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="p-8 space-y-8">
                            <div className="flex gap-8">
                                {/* Image Upload Information */}
                                <div className="w-1/3 space-y-4">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Product Image</label>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-700 bg-gray-950 group hover:border-pink-500 transition-colors">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                                <ImageIcon className="w-10 h-10 mb-2" />
                                                <span className="text-xs">Upload Image</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <p className="text-white text-sm font-medium">Change Image</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">Supports JPG, PNG (Max 5MB)</p>
                                </div>

                                {/* Fields */}
                                <div className="w-2/3 space-y-6">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-sm font-medium text-gray-400">Item No.</label>
                                            <input type="text" value={formData.itemNumber} onChange={e => setFormData({ ...formData, itemNumber: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 focus:border-pink-500 outline-none" placeholder="SKU-001" />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-sm font-medium text-gray-400">Product Name</label>
                                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all" placeholder="e.g. Luxury Shampoo" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Category</label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 focus:border-pink-500 outline-none appearance-none"
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-3.5 pointer-events-none text-gray-500">▼</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Stock</label>
                                            <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 focus:border-pink-500 outline-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Price (Rs.)</label>
                                        <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 focus:border-pink-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Description</label>
                                <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 focus:border-pink-500 outline-none resize-none"></textarea>
                            </div>

                            <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
                                <span className="text-gray-400 font-medium">Visibility Settings</span>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.showInWebsite ? 'bg-pink-600 border-pink-600' : 'border-gray-600 bg-gray-900'}`}>
                                            {formData.showInWebsite && <Plus className="w-4 h-4 text-white rotate-45 transform" />}
                                            <input type="checkbox" checked={formData.showInWebsite} onChange={e => setFormData({ ...formData, showInWebsite: e.target.checked })} className="hidden" />
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${formData.showInWebsite ? 'text-white' : 'text-gray-500'}`}>Show in Website</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.showInPOS ? 'bg-blue-600 border-blue-600' : 'border-gray-600 bg-gray-900'}`}>
                                            <input type="checkbox" checked={formData.showInPOS} onChange={e => setFormData({ ...formData, showInPOS: e.target.checked })} className="hidden" />
                                            {formData.showInPOS && <Plus className="w-4 h-4 text-white rotate-45 transform" />}
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${formData.showInPOS ? 'text-white' : 'text-gray-500'}`}>Show in POS</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-400">Related Products</label>
                                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
                                    {products.filter(p => p._id !== editingProduct?._id).map(prod => {
                                        const isSelected = formData.relatedProducts?.includes(prod._id);
                                        return (
                                            <div
                                                key={prod._id}
                                                onClick={() => {
                                                    const current = formData.relatedProducts || [];
                                                    const updated = isSelected
                                                        ? current.filter(id => id !== prod._id)
                                                        : [...current, prod._id];
                                                    setFormData({ ...formData, relatedProducts: updated });
                                                }}
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected
                                                    ? 'bg-purple-600/20 border-purple-500'
                                                    : 'bg-gray-950 border-gray-800 hover:border-gray-700'
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-600'}`}>
                                                    {isSelected && <Plus className="w-3 h-3 text-white rotate-45" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>{prod.name}</p>
                                                    <p className="text-xs text-gray-600">Rs. {prod.price}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-4 border-t border-gray-800">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition-all">Cancel</button>
                                <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-pink-500/25 flex items-center gap-2 transition-all disabled:opacity-50">
                                    <Save className="w-5 h-5" />
                                    {loading ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 w-full max-w-md rounded-3xl border border-gray-700 shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">New Category</h2>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category Name</label>
                                <input type="text" required value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none" placeholder="e.g. Hair Care" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description (Optional)</label>
                                <textarea rows="2" value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none" placeholder="Short description..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                                Create Category
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
