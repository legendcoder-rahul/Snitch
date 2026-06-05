import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

const HeartIcon = ({ filled }) => (
    <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const Explore = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleSearchProducts, handleGetAllProducts } = useProduct();

    const query = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('relevance');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [localSearch, setLocalSearch] = useState(query);

    useEffect(() => {
        setLocalSearch(query);
    }, [query]);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                let results;
                if (query.trim()) {
                    results = await handleSearchProducts(query);
                } else {
                    results = await handleGetAllProducts();
                }
                setProducts(results || []);
            } catch (err) {
                console.error('Failed to fetch products', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [query]);

    const sortedProducts = useMemo(() => {
        const list = [...products];
        switch (sortBy) {
            case 'price-low':
                return list.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
            case 'price-high':
                return list.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
            case 'newest':
                return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            default:
                return list;
        }
    }, [products, sortBy]);

    const handleLocalSearch = (e) => {
        e.preventDefault();
        if (localSearch.trim()) {
            setSearchParams({ q: localSearch.trim() });
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');

                .explore-root {
                    font-family: 'DM Sans', sans-serif;
                    background: #fafafa;
                    min-height: 100vh;
                }

                /* Product card */
                .product-card {
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #f0f0f0;
                }
                .product-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    border-color: transparent;
                }
                .product-card:hover .card-img {
                    transform: scale(1.06);
                }
                .product-card:hover .card-overlay {
                    opacity: 1;
                }

                .card-img {
                    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .card-overlay {
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                /* Sort select */
                .sort-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                    background-size: 16px;
                    padding-right: 36px;
                }

                /* View toggle */
                .view-btn {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1.5px solid #e0e0e0;
                    background: #fff;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.15s;
                    color: #999;
                }
                .view-btn.active {
                    border-color: #111;
                    color: #111;
                    background: #f5f5f5;
                }
                .view-btn:hover:not(.active) {
                    border-color: #bbb;
                    color: #666;
                }

                /* Skeleton */
                @keyframes shimmer {
                    0% { background-position: -400px 0; }
                    100% { background-position: 400px 0; }
                }
                .skeleton {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 400px 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 8px;
                }

                /* Search bar on explore page */
                .explore-search {
                    background: #fff;
                    border: 2px solid #e8e8e8;
                    border-radius: 12px;
                    transition: all 0.25s;
                }
                .explore-search:focus-within {
                    border-color: #111;
                    box-shadow: 0 0 0 4px rgba(0,0,0,0.04);
                }

                /* Tag pill */
                .tag-active {
                    background: #111;
                    color: #fff;
                }

                /* List view card */
                .list-card {
                    display: flex;
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #f0f0f0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .list-card:hover {
                    box-shadow: 0 12px 32px rgba(0,0,0,0.06);
                    border-color: transparent;
                }
                .list-card:hover .card-img {
                    transform: scale(1.04);
                }
            `}</style>

            <div className="explore-root">
                {/* ── Hero Search Header ── */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 md:py-12">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
                            <button onClick={() => navigate('/')} className="hover:text-gray-700 transition bg-transparent border-none cursor-pointer p-0 font-inherit text-xs text-gray-400">Home</button>
                            <span>›</span>
                            <span className="text-gray-700">Explore</span>
                            {query && (
                                <>
                                    <span>›</span>
                                    <span className="text-gray-700">"{query}"</span>
                                </>
                            )}
                        </nav>

                        {/* Title */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-2">
                                    {query ? 'Search Results' : 'Browse All'}
                                </p>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                                    {query ? (
                                        <>
                                            Results for <span className="italic">"{query}"</span>
                                        </>
                                    ) : (
                                        'Explore Products'
                                    )}
                                </h1>
                            </div>
                            {!loading && (
                                <p className="text-sm text-gray-500">
                                    <span className="font-bold text-gray-900">{sortedProducts.length}</span> product{sortedProducts.length !== 1 ? 's' : ''} found
                                </p>
                            )}
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleLocalSearch} className="explore-search flex items-center overflow-hidden max-w-2xl">
                            <div className="pl-4 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                placeholder="Search products, brands, categories..."
                                className="flex-1 px-4 py-3.5 text-sm outline-none bg-transparent"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            />
                            {localSearch && (
                                <button
                                    type="button"
                                    onClick={() => { setLocalSearch(''); setSearchParams({}); }}
                                    className="px-2 text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-6 py-3.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition m-1 rounded-lg"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                {/* ── Toolbar ── */}
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        {/* Left: Sort */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort by</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select text-sm font-medium text-gray-800 border border-gray-200 rounded-lg px-4 py-2 outline-none bg-white cursor-pointer focus:border-gray-900 transition"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Right: View toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                title="Grid view"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                    <rect width="6" height="6" rx="1" />
                                    <rect x="10" width="6" height="6" rx="1" />
                                    <rect y="10" width="6" height="6" rx="1" />
                                    <rect x="10" y="10" width="6" height="6" rx="1" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                title="List view"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                    <rect width="16" height="3" rx="1" />
                                    <rect y="6.5" width="16" height="3" rx="1" />
                                    <rect y="13" width="16" height="3" rx="1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Products ── */}
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16">
                    {loading ? (
                        /* Skeleton Loading */
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                            : "flex flex-col gap-4"
                        }>
                            {Array(8).fill(null).map((_, i) => (
                                viewMode === 'grid' ? (
                                    <div key={i} className="rounded-xl overflow-hidden">
                                        <div className="skeleton aspect-[3/4] w-full" />
                                        <div className="p-4 space-y-3">
                                            <div className="skeleton h-4 w-3/4" />
                                            <div className="skeleton h-3 w-1/2" />
                                            <div className="skeleton h-5 w-1/3" />
                                        </div>
                                    </div>
                                ) : (
                                    <div key={i} className="flex rounded-xl overflow-hidden bg-white">
                                        <div className="skeleton w-48 h-48 flex-shrink-0" />
                                        <div className="p-5 flex-1 space-y-3">
                                            <div className="skeleton h-5 w-2/3" />
                                            <div className="skeleton h-3 w-full" />
                                            <div className="skeleton h-3 w-1/2" />
                                            <div className="skeleton h-6 w-1/4 mt-4" />
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    ) : sortedProducts.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-sm">
                                We couldn't find anything matching <span className="font-semibold text-gray-700">"{query}"</span>.
                                Try adjusting your search or browse all products.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setLocalSearch(''); setSearchParams({}); }}
                                    className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black transition"
                                >
                                    Browse All
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-lg hover:border-gray-900 transition"
                                >
                                    Go Home
                                </button>
                            </div>
                        </div>
                    ) : viewMode === 'grid' ? (
                        /* Grid View */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {sortedProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="product-card cursor-pointer"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                        <img
                                            src={product.images?.[0]?.url || 'https://placehold.co/400x500/f3f4f6/9ca3af?text=No+Image'}
                                            alt={product.title}
                                            className="card-img w-full h-full object-cover"
                                        />
                                        {/* Overlay */}
                                        <div className="card-overlay absolute inset-0 bg-black/40 flex items-center justify-center gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                                                className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-100 transition"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                        {/* Wishlist */}
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:text-red-500 transition z-10"
                                        >
                                            <HeartIcon />
                                        </button>
                                        {/* Variants badge */}
                                        {product.variants?.length > 0 && (
                                            <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-md tracking-widest z-10">
                                                {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm mb-1.5 line-clamp-2 leading-snug min-h-[2.5rem]">
                                            {product.title}
                                        </h3>
                                        {product.description && (
                                            <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                                                {product.description}
                                            </p>
                                        )}
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-black text-lg text-gray-900">
                                                {product.price?.currency || 'INR'} {product.price?.amount?.toLocaleString() || '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="flex flex-col gap-4">
                            {sortedProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="list-card cursor-pointer"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <div className="w-40 sm:w-52 flex-shrink-0 overflow-hidden bg-gray-100">
                                        <img
                                            src={product.images?.[0]?.url || 'https://placehold.co/400x500/f3f4f6/9ca3af?text=No+Image'}
                                            alt={product.title}
                                            className="card-img w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-5 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="font-bold text-gray-900 text-base leading-snug">
                                                    {product.title}
                                                </h3>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition bg-transparent border-none cursor-pointer p-1"
                                                >
                                                    <HeartIcon />
                                                </button>
                                            </div>
                                            {product.description && (
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                                                    {product.description}
                                                </p>
                                            )}
                                            {product.variants?.length > 0 && (
                                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md mb-3">
                                                    {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-black text-xl text-gray-900">
                                                {product.price?.currency || 'INR'} {product.price?.amount?.toLocaleString() || '0'}
                                            </span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                                                className="px-5 py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-black transition"
                                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                                            >
                                                View Product
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Explore;