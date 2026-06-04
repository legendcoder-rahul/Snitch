import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const MAX_IMAGES = 7;

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const newImages = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [images]);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const removeImage = (index) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img.file));
            await handleCreateProduct(data);
            navigate('/');
        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
            <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-16">

                {/* ── Breadcrumb / Back ── */}
                <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
                    <button onClick={() => navigate('/')} className="hover:text-gray-700 transition bg-transparent border-none cursor-pointer p-0 font-inherit text-xs text-gray-400">Home</button>
                    <span>›</span>
                    <button onClick={() => navigate('/seller/dashboard')} className="hover:text-gray-700 transition bg-transparent border-none cursor-pointer p-0 font-inherit text-xs text-gray-400">Dashboard</button>
                    <span>›</span>
                    <span className="text-gray-700">New Listing</span>
                </nav>

                {/* ── Page Header ── */}
                <div className="mb-10">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">Create Product</p>
                    <h1 className="text-4xl md:text-5xl font-black uppercase text-gray-900 leading-tight">
                        New Listing
                    </h1>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                        {/* ── LEFT COLUMN: Text Fields ── */}
                        <div className="flex flex-col gap-8">

                            {/* Product Title */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="cp-title" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Product Title
                                </label>
                                <input
                                    id="cp-title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Oversized Linen Shirt"
                                    className="w-full bg-transparent outline-none py-3 text-sm border-b-2 border-gray-200 focus:border-black transition-colors duration-200 placeholder:text-gray-300"
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="cp-description" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Description
                                </label>
                                <textarea
                                    id="cp-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Describe the product — material, fit, details..."
                                    className="w-full bg-transparent outline-none py-3 text-sm border-b-2 border-gray-200 focus:border-black transition-colors duration-200 resize-none leading-relaxed placeholder:text-gray-300"
                                />
                            </div>

                            {/* Price */}
                            <div className="flex flex-col gap-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Price</label>
                                <div className="flex gap-4 items-end">
                                    {/* Amount */}
                                    <div className="flex flex-col gap-1 flex-[3]">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400">Amount</span>
                                        <input
                                            id="cp-priceAmount"
                                            type="number"
                                            name="priceAmount"
                                            value={formData.priceAmount}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="w-full bg-transparent outline-none py-3 text-sm border-b-2 border-gray-200 focus:border-black transition-colors duration-200 placeholder:text-gray-300"
                                        />
                                    </div>
                                    {/* Currency */}
                                    <div className="flex flex-col gap-1 flex-[1]">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-400">Currency</span>
                                        <select
                                            id="cp-priceCurrency"
                                            name="priceCurrency"
                                            value={formData.priceCurrency}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none py-3 text-sm cursor-pointer appearance-none border-b-2 border-gray-200 focus:border-black transition-colors duration-200"
                                        >
                                            {CURRENCIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Images ── */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Images</label>
                                <span className="text-xs text-gray-400">{images.length}/{MAX_IMAGES}</span>
                            </div>

                            {/* Drop Zone */}
                            {images.length < MAX_IMAGES && (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl px-8 py-14 lg:py-20 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 ${isDragging ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${isDragging ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">
                                            Drop images here or{' '}
                                            <span className="text-black font-semibold underline underline-offset-2">tap to upload</span>
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-2">Up to {MAX_IMAGES} images</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            )}

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-1">
                                    {images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group"
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-bold tracking-widest uppercase bg-black/50 text-white"
                                                aria-label={`Remove image ${index + 1}`}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Submit Button ── */}
                    <div className="mt-12 lg:mt-16">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;