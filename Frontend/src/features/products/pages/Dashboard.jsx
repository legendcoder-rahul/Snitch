import React, { useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const { handleGetSellerProducts } = useProduct();
    const sellerProducts = useSelector(state => state.product.sellerProducts);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetSellerProducts();
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
            <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-16">

                {/* ── Page Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">Seller Dashboard</p>
                        <h1 className="text-4xl md:text-5xl font-black uppercase text-gray-900 leading-tight">
                            Your Products
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate('/seller/create-product')}
                        className="px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition w-full md:w-auto text-center"
                    >
                        + New Listing
                    </button>
                </div>

                {/* ── Product Grid ── */}
                {sellerProducts && sellerProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {sellerProducts.map(product => {
                            const imageUrl = product.images && product.images.length > 0
                                ? product.images[0].url
                                : 'https://placehold.co/400x500/e5e7eb/374151?text=No+Image';

                            return (
                                <div
                                    onClick={() => navigate(`/seller/product/${product._id}`)}
                                    key={product._id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition cursor-pointer group overflow-hidden"
                                >
                                    {/* Image Container */}
                                    <div className="relative bg-gray-100 aspect-[4/5] overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        {/* Variant count badge */}
                                        {product.variants?.length > 0 && (
                                            <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold uppercase px-2 py-1 tracking-widest">
                                                {product.variants.length} Variant{product.variants.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10">
                                            {product.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="font-black text-base text-gray-900">
                                            {product.price?.currency} {product.price?.amount?.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-24 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black uppercase text-gray-900">No Products Yet</h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                            You haven't listed any products yet. Start by creating your first listing.
                        </p>
                        <button
                            onClick={() => navigate('/seller/create-product')}
                            className="mt-2 px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                        >
                            Create First Listing
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;