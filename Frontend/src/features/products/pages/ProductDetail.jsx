import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hook/useCart';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [addedToCart, setAddedToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddToCart } = useCart();

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => { fetchProductDetails(); }, [productId]);

    // Don't pre-select any attributes — let the user choose
    useEffect(() => {
        setSelectedAttributes({});
    }, [product]);

    useEffect(() => { setSelectedImage(0); }, [selectedAttributes]);

    const hasVariants = product?.variants?.length > 0;

    const activeVariant = useMemo(() => {
        if (!hasVariants) return null;
        return product.variants.find(v => {
            if (!v.attributes) return false;
            const vKeys = Object.keys(v.attributes);
            const sKeys = Object.keys(selectedAttributes);
            return vKeys.length === sKeys.length && vKeys.every(k => v.attributes[k] === selectedAttributes[k]);
        });
    }, [product, selectedAttributes, hasVariants]);

    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(v => {
            if (v.attributes) {
                Object.entries(v.attributes).forEach(([k, val]) => {
                    if (!attrs[k]) attrs[k] = new Set();
                    attrs[k].add(val);
                });
            }
        });
        Object.keys(attrs).forEach(k => { attrs[k] = Array.from(attrs[k]); });
        return attrs;
    }, [product]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [attrName]: value };
        const exactMatch = product.variants.find(v => {
            const vA = v.attributes || {};
            return Object.keys(newAttrs).every(k => newAttrs[k] === vA[k]) &&
                Object.keys(vA).every(k => newAttrs[k] === vA[k]);
        });
        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            const fallback = product.variants.find(v => v.attributes?.[attrName] === value);
            setSelectedAttributes(fallback ? fallback.attributes : newAttrs);
        }
    };

    const onAddToCart = async () => {
        if (hasVariants && !activeVariant) {
            alert('Please select all options (color, size, etc.) before adding to cart.');
            return;
        }
        try {
            await handleAddToCart(product._id, activeVariant?._id);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (err) {
            console.error('Add to cart failed', err);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
                <span className="text-3xl font-black uppercase tracking-widest text-gray-900 animate-pulse"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    Loading...
                </span>
            </div>
        );
    }

    const displayImages = (activeVariant?.images?.length > 0)
        ? activeVariant.images
        : (product.images?.length > 0 ? product.images : [{ url: '/snitch_editorial_warm.png' }]);

    const displayPrice = activeVariant?.price?.amount ? activeVariant.price : product.price;
    const inStock = activeVariant ? activeVariant.stock > 0 : true;
    const stockCount = activeVariant?.stock ?? 0;

    // Detect if attribute is a color (check if value looks like a color name)
    const COLOR_NAMES = ['red', 'blue', 'green', 'black', 'white', 'yellow', 'pink', 'purple', 'orange', 'gray', 'grey', 'brown', 'navy', 'beige', 'cream'];
    const isColorAttr = (attrName, values) => {
        return attrName.toLowerCase().includes('color') ||
            values.some(v => COLOR_NAMES.includes(v.toLowerCase()));
    };

    const COLOR_MAP = {
        red: '#ef4444', blue: '#3b82f6', green: '#22c55e', black: '#111111',
        white: '#f5f5f5', yellow: '#eab308', pink: '#ec4899', purple: '#a855f7',
        orange: '#f97316', gray: '#9ca3af', grey: '#9ca3af', brown: '#92400e',
        navy: '#1e3a8a', beige: '#d2b48c', cream: '#fffdd0',
    };

    const TABS = [
        { id: 'description', label: 'Description' },
        { id: 'additional', label: 'Additional Info' },
        { id: 'reviews', label: 'Reviews (23)' },
        { id: 'questions', label: 'Questions' },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

                * { box-sizing: border-box; }

                .pd-root { font-family: 'DM Sans', sans-serif; background: #fff; color: #111; }

                /* Thumbnails */
                .thumb { border: 2px solid transparent; transition: border-color 0.15s; cursor: pointer; }
                .thumb.active { border-color: #111; }
                .thumb:hover:not(.active) { border-color: #ccc; }

                /* Size buttons */
                .size-btn {
                    min-width: 42px; height: 42px; padding: 0 10px;
                    border: 1.5px solid #e0e0e0;
                    background: #fff; color: #111;
                    font-size: 13px; font-weight: 500;
                    cursor: pointer; transition: all 0.15s;
                    font-family: 'DM Sans', sans-serif;
                }
                .size-btn.active { border-color: #111; background: #111; color: #fff; }
                .size-btn:hover:not(.active) { border-color: #888; }

                /* Color swatches */
                .color-swatch {
                    width: 30px; height: 30px; border-radius: 50%;
                    border: 2px solid transparent;
                    cursor: pointer; transition: all 0.15s;
                    outline-offset: 2px;
                }
                .color-swatch.active { outline: 2px solid #111; }
                .color-swatch:hover:not(.active) { outline: 2px solid #ccc; }

                /* Add to cart button */
                .btn-cart {
                    background: #111; color: #fff;
                    border: none; cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 600; font-size: 14px;
                    letter-spacing: 0.04em;
                    transition: background 0.2s;
                    width: 100%; padding: 16px;
                }
                .btn-cart:hover { background: #333; }
                .btn-cart:disabled { background: #ccc; cursor: not-allowed; }

                /* Quantity stepper */
                .qty-btn {
                    width: 40px; height: 44px;
                    border: 1.5px solid #e0e0e0; background: #fff;
                    font-size: 18px; cursor: pointer; color: #111;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.15s;
                }
                .qty-btn:hover { background: #f5f5f5; }
                .qty-input {
                    flex: 1; height: 44px; border-top: 1.5px solid #e0e0e0;
                    border-bottom: 1.5px solid #e0e0e0; border-left: none; border-right: none;
                    text-align: center; font-size: 14px; font-weight: 600;
                    font-family: 'DM Sans', sans-serif; color: #111;
                    background: #fff; outline: none;
                }

                /* Tabs */
                .tab-btn {
                    font-size: 13px; font-weight: 500; color: #888;
                    background: none; border: none; padding: 12px 0;
                    cursor: pointer; border-bottom: 2px solid transparent;
                    transition: all 0.15s; white-space: nowrap;
                    font-family: 'DM Sans', sans-serif;
                }
                .tab-btn.active { color: #111; border-bottom-color: #111; }
                .tab-btn:hover:not(.active) { color: #444; }

                /* Related card */
                .rel-card { cursor: pointer; }
                .rel-card img { transition: transform 0.35s; }
                .rel-card:hover img { transform: scale(1.04); }

                /* Tag pill */
                .tag-pill {
                    display: inline-block; padding: 2px 10px;
                    background: #f3f4f6; color: #555;
                    font-size: 11px; border-radius: 999px;
                }

                /* Star */
                .star { color: #f59e0b; }
                .star.empty { color: #e0e0e0; }

                /* Discount badge */
                .badge-discount {
                    background: #ef4444; color: #fff;
                    font-size: 11px; font-weight: 700;
                    padding: 3px 8px;
                }

                /* Action links */
                .action-link {
                    font-size: 13px; color: #555; cursor: pointer;
                    display: flex; align-items: center; gap-6px;
                    background: none; border: none; padding: 0;
                    font-family: 'DM Sans', sans-serif;
                    transition: color 0.15s;
                }
                .action-link:hover { color: #111; }

                /* Meta row */
                .meta-label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 0.08em; width: 80px; }
                .meta-value { font-size: 12px; color: #555; }
            `}</style>

            <div className="pd-root min-h-screen">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

                    {/* ── Breadcrumb ─────────────────────── */}
                    <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
                        <button onClick={() => navigate('/')} className="hover:text-gray-700 transition bg-transparent border-none cursor-pointer p-0 font-inherit text-xs text-gray-400">Home</button>
                        <span>›</span>
                        <button onClick={() => navigate(-1)} className="hover:text-gray-700 transition bg-transparent border-none cursor-pointer p-0 font-inherit text-xs text-gray-400">
                            {product.category || 'Clothing'}
                        </button>
                        <span>›</span>
                        <span className="text-gray-700">{product.title}</span>
                    </nav>

                    {/* ── Product Top Section ────────────── */}
                    <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 mb-16">

                        {/* ── LEFT: Image Gallery ─────────── */}
                        <div className="w-full lg:w-[48%]">
                            {/* Main Image */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50 mb-4 rounded-sm">
                                <img
                                    src={displayImages[selectedImage]?.url || displayImages[0].url}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Discount badge */}
                                {activeVariant?.comparePrice && (
                                    <span className="badge-discount absolute top-4 left-4">
                                        -{Math.round((1 - displayPrice.amount / activeVariant.comparePrice) * 100)}%
                                    </span>
                                )}
                            </div>

                            {/* Thumbnails row */}
                            {displayImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-1">
                                    {displayImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`thumb flex-shrink-0 w-20 aspect-[4/5] overflow-hidden bg-gray-50 rounded-sm`}
                                            style={{ borderColor: selectedImage === idx ? '#111' : 'transparent' }}
                                        >
                                            <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT: Product Info ─────────── */}
                        <div className="w-full lg:w-[52%] flex flex-col">

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {product.title}
                            </h1>

                            {/* Stars + Reviews */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <svg key={s} className={`w-4 h-4 ${s <= 4 ? 'star' : 'star empty'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">23 Reviews</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-3">
                                <span className="text-2xl font-bold text-gray-900">
                                    {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                                {activeVariant?.comparePrice && (
                                    <span className="text-base text-gray-400 line-through">
                                        {displayPrice?.currency} {activeVariant.comparePrice.toLocaleString()}
                                    </span>
                                )}
                            </div>



                            <div className="h-px bg-gray-100 mb-5" />

                            {/* Attributes */}
                            {Object.entries(availableAttributes).map(([attrName, values]) => {
                                const isColor = isColorAttr(attrName, values);
                                return (
                                    <div key={attrName} className="mb-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-sm font-semibold text-gray-700">{attrName}:</span>
                                            {!isColor && (
                                                <span className="text-sm text-gray-500">{selectedAttributes[attrName]}</span>
                                            )}
                                        </div>

                                        {isColor ? (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {values.map(val => {
                                                    const bg = COLOR_MAP[val.toLowerCase()] || val;
                                                    const isActive = selectedAttributes[attrName] === val;
                                                    return (
                                                        <button
                                                            key={val}
                                                            title={val}
                                                            onClick={() => handleAttributeChange(attrName, val)}
                                                            className={`color-swatch ${isActive ? 'active' : ''}`}
                                                            style={{ backgroundColor: bg }}
                                                        />
                                                    );
                                                })}
                                                {selectedAttributes[attrName] && (
                                                    <button
                                                        onClick={() => setSelectedAttributes(prev => { const n = { ...prev }; delete n[attrName]; return n; })}
                                                        className="text-xs text-gray-400 hover:text-gray-700 ml-1 bg-transparent border-none cursor-pointer p-0"
                                                    >
                                                        × Clear
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {values.map(val => (
                                                    <button
                                                        key={val}
                                                        onClick={() => handleAttributeChange(attrName, val)}
                                                        className={`size-btn ${selectedAttributes[attrName] === val ? 'active' : ''}`}
                                                    >
                                                        {val}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Size Guide + Stock */}
                            <div className="flex items-center gap-4 mb-5 text-sm">
                                <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition bg-transparent border-none cursor-pointer p-0 font-inherit text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                                    </svg>
                                    Size Guide
                                </button>
                                {activeVariant && (
                                    <span className={`flex items-center gap-1.5 font-medium ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                                        {inStock ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {stockCount} In Stock
                                            </>
                                        ) : 'Out of Stock'}
                                    </span>
                                )}
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex mb-4" style={{ maxWidth: 180 }}>
                                <button className="qty-btn rounded-l-sm" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                <input
                                    type="number"
                                    className="qty-input"
                                    value={quantity}
                                    min={1}
                                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                                <button className="qty-btn rounded-r-sm" onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                className="btn-cart mb-4 rounded-sm"
                                onClick={onAddToCart}
                                disabled={hasVariants ? (!activeVariant || !inStock) : false}
                            >
                                {addedToCart ? '✓ Added to Cart' : hasVariants && !activeVariant ? 'Select Options' : !inStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>

                            {/* Action links */}
                            <div className="flex items-center gap-6 mb-6">
                                <button className="action-link flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Wishlist
                                </button>
                                <button className="action-link flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Ask question
                                </button>
                                <button className="action-link flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share
                                </button>
                            </div>

                            <div className="h-px bg-gray-100 mb-5" />

                            {/* Meta info */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="meta-label">SKU</span>
                                    <span className="meta-value">{product._id?.slice(-6)?.toUpperCase() || '1162'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="meta-label">Category</span>
                                    <span className="meta-value">{product.category || 'Clothing'}</span>
                                </div>
                                {product.tags?.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <span className="meta-label">Tags</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {product.tags.map(tag => (
                                                <span key={tag} className="tag-pill">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Tabs Section ───────────────────── */}
                    <div className="mb-16">
                        <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="max-w-2xl">
                            {activeTab === 'description' && (
                                <div>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                                        {product.description || 'No description available for this product.'}
                                    </p>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Information</h4>
                                    <ul className="space-y-2">
                                        {['Fabric: Premium quality', 'Fit type: Regular fit', 'Feature: Comfortable wear', 'Front and back pockets'].map(item => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'additional' && (
                                <div className="space-y-3">
                                    {[['Material', 'Premium Cotton Blend'], ['Weight', '0.4 kg'], ['Dimensions', '30 × 20 × 5 cm'], ['Country', 'India']].map(([k, v]) => (
                                        <div key={k} className="flex gap-8 py-2 border-b border-gray-100 text-sm">
                                            <span className="w-28 text-gray-500 font-medium">{k}</span>
                                            <span className="text-gray-800">{v}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'reviews' && (
                                <div className="space-y-5">
                                    {[{ name: 'Sarah M.', rating: 5, text: 'Absolutely love the quality and fit. Would definitely buy again!', date: 'Jan 12, 2026' },
                                    { name: 'Rohan K.', rating: 4, text: 'Great product, fast delivery. Slight color difference from photos.', date: 'Feb 3, 2026' }].map((r, i) => (
                                        <div key={i} className="border-b border-gray-100 pb-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-sm text-gray-900">{r.name}</span>
                                                <span className="text-xs text-gray-400">{r.date}</span>
                                            </div>
                                            <div className="flex mb-2">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <svg key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'star' : 'star empty'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600">{r.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'questions' && (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500">Have a question? Ask below.</p>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Type your question..."
                                            className="flex-1 px-4 py-2.5 border border-gray-200 text-sm outline-none focus:border-gray-900 transition rounded-sm"
                                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                                        />
                                        <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-700 transition"
                                            style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── You Might Also Like ─────────────── */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900">You might also like</h2>
                            <div className="flex gap-2">
                                <button className="w-9 h-9 border border-gray-200 flex items-center justify-center hover:border-gray-900 transition rounded-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button className="w-9 h-9 border border-gray-200 flex items-center justify-center hover:border-gray-900 transition rounded-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {Array(4).fill(null).map((_, i) => (
                                <div key={i} className="rel-card">
                                    <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden rounded-sm">
                                        <img
                                            src={`https://placehold.co/300x400/f3f4f6/9ca3af?text=Product+${i + 1}`}
                                            alt={`Related ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 mb-1">Product Name</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-gray-900">
                                            {displayPrice?.currency} {(displayPrice?.amount || 56)?.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-400 line-through">
                                            {displayPrice?.currency} {Math.round((displayPrice?.amount || 56) * 1.5)?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProductDetail;