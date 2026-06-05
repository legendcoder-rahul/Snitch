import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';
import landingimg from '../../../assets/product9.png';
import women from '../../../assets/product2.png';
import womentTshirt from '../../../assets/t-shirt-w.jfif';
import menTshirt from '../../../assets/t-shirt-m.jfif';
import newArrival from '../../../assets/new2.jfif';


/* ─── Placeholder data ─────────────────────────────── */
const FLASH_PRODUCTS = [
    { id: 1, name: "EliteShield Performance Men's Jackets", price: "Rp255.000", oldPrice: "Rp625.000", sold: 9, total: 10, img: "https://placehold.co/400x500/e5e7eb/374151?text=Jacket" },
    { id: 2, name: "Gentlemen's Summer Gray Hat", price: "Rp99.000", oldPrice: "Rp150.000", sold: 9, total: 10, img: "https://placehold.co/400x500/e5e7eb/374151?text=Hat" },
    { id: 3, name: "OptiZoom Camera Shoulder Bag", price: "Rp250.000", oldPrice: "Rp425.000", sold: 5, total: 10, img: "https://placehold.co/400x500/e5e7eb/374151?text=Bag" },
    { id: 4, name: "Cloudy Chic – Grey Peep Toe Heels", price: "Rp270.000", oldPrice: "Rp580.000", sold: 5, total: 10, img: "https://placehold.co/400x500/e5e7eb/374151?text=Shoes" },
];

const TODAY_PRODUCTS = [
    { id: 1, name: "UrbanEdge Men's Jeans Collection", rating: 4.9, sold: "10K+", price: "Rp253.000", img: "https://placehold.co/400x500/e5e7eb/374151?text=Jeans", tag: "Best Seller" },
    { id: 2, name: "Essentials Men's Long-Sleeve Oxford Shirt", rating: 4.9, sold: "10K+", price: "Rp179.000", img: "https://placehold.co/400x500/e5e7eb/374151?text=Shirt", tag: "Best Seller" },
    { id: 3, name: "StyleHaven Men's Fashionable Brogues", rating: 4.9, sold: "8K+", price: "Rp199.000", img: "https://placehold.co/400x500/e5e7eb/374151?text=Shoes" },
    { id: 4, name: "Essential Long-Sleeve Crewneck Shirt", rating: 4.9, sold: "5K+", price: "Rp120.000", img: "https://placehold.co/400x500/e5e7eb/374151?text=Crewneck" },
    { id: 5, name: "ClassicGent Men's Formal Shoes", rating: 4.9, sold: "4K+", price: "Rp199.000", img: "https://placehold.co/400x500/e5e7eb/374151?text=Formal" },
    { id: 6, name: "UrbanFlex Men's Short Pants", rating: 4.9, sold: "2K+", price: "Rp162.000", img: "https://placehold.co/400x500/e5e7eb/374151?text=Shorts" },
    { id: 7, name: "ChicCarry – Elegant Women's Tote", rating: 4.9, sold: "500+", price: "Rp650.000", img: "https://placehold.co/400x500/e5e7eb/374151?text=Tote" },
    { id: 8, name: "Sophisticated Women's Parka Line", rating: 4.9, sold: "100+", price: "Rp324.000", img: "https://placehold.co/400x500/e5e7eb/374151?text=Parka" },
];

const CATEGORIES = [
    { label: 'Hoodie', icon: '🧥' },
    { label: 'Caps & Bags', icon: '🧢' },
    { label: 'Trending', icon: '🔥' },
    { label: 'Out Wear', icon: '🧤' },
    { label: 'Accessories', icon: '⌚' },
];

const TABS = ['Best Seller', 'Keep Stylish', 'Special Discount', 'Official Store', 'Coveted Product'];

/* ─── Heart icon ─────────────────────────────────────── */
const HeartIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

/* ─── Countdown timer ────────────────────────────────── */
const useCountdown = (h, m, s) => {
    const [time, setTime] = useState({ h, m, s });
    useEffect(() => {
        const id = setInterval(() => {
            setTime(prev => {
                let { h, m, s } = prev;
                if (s > 0) return { h, m, s: s - 1 };
                if (m > 0) return { h, m: m - 1, s: 59 };
                if (h > 0) return { h: h - 1, m: 59, s: 59 };
                return { h: 0, m: 0, s: 0 };
            });
        }, 1000);
        return () => clearInterval(id);
    }, []);
    return time;
};

/* ═══════════════════════════════════════════════════════
   HOME COMPONENT
═══════════════════════════════════════════════════════ */
const Home = () => {
    const navigate = useNavigate();
    const { handleGetAllProducts } = useProduct();
    const products = useSelector(state => state.product.products);
    const [activeTab, setActiveTab] = useState('Best Seller');
    const [activeCategory, setActiveCategory] = useState('Hoodie');
    const countdown = useCountdown(8, 17, 56);

    useEffect(() => { handleGetAllProducts(); }, []);

    const pad = n => String(n).padStart(2, '0');

    const flashList = products?.length ? products.slice(0, 4) : FLASH_PRODUCTS;
    const todayList = products?.length ? products : TODAY_PRODUCTS;

    const mapProduct = (p, isFlash = false) => {
        const isReal = !!p._id;
        return {
            id: isReal ? p._id : p.id,
            name: isReal ? p.title : p.name,
            img: isReal ? (p.images?.[0]?.url || '/hero.jfif') : p.img,
            price: isReal ? `${p.price?.currency || 'INR'} ${p.price?.amount || 0}` : p.price,
            oldPrice: isReal ? `${p.price?.currency || 'INR'} ${Math.round((p.price?.amount || 0) * 1.5)}` : p.oldPrice,
            sold: isReal ? 8 : (isFlash ? p.sold : p.sold),
            total: isReal ? 10 : (isFlash ? p.total : 10),
            rating: isReal ? 4.9 : p.rating,
            soldLabel: isReal ? '100+' : p.sold,
            tag: p.tag || null,
            isReal,
        };
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">

            <main>
                {/* ── HERO ─────────────────────────────────── */}
                <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#f5f4f0]">
                    {/* Background text watermark */}
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[22vw] font-black text-gray-100 uppercase leading-none select-none pointer-events-none tracking-tighter">
                        MODE
                    </span>

                    <div className="max-w-[1200px] mx-auto px-6 w-full flex flex-col md:flex-row items-center gap-12 relative z-10 py-20">
                        {/* Text */}
                        <div className="flex-1 max-w-lg">
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">#Big Fashion Sale</p>
                            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tight mb-6 text-gray-900">
                                Snitch<br />
                                <span className="italic font-black">FASHION</span>
                            </h1>
                            <p className="text-sm text-gray-500 leading-relaxed mb-2 max-w-sm">
                                Discover a fashion experience that not only mirrors your unique personality but defines it. At Snitch, every collection is designed to celebrate individuality, and empower you to stand out effortlessly in any setting.
                            </p>
                            <p className="text-4xl font-black text-gray-900 mb-8">
                                Up to <span className="italic">50% OFF!</span>
                            </p>
                            <div className="flex gap-4 flex-wrap">
                                <button
                                    onClick={() => navigate('/explore')}
                                    className="px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                                >
                                    Buy Product
                                </button>
                                <button
                                    onClick={() => navigate('/explore')}
                                    className="px-8 py-3.5 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition"
                                >
                                    Explore Product
                                </button>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="flex-1 flex justify-center items-end h-[60vh] md:h-[75vh] max-w-md relative">
                            <div className="w-full h-full relative">
                                <img
                                    src={landingimg}
                                    alt="Snitch Fashion"
                                    className="w-full h-full object-cover object-center"
                                />
                                {/* Floating badge */}
                                <div className="absolute top-6 left-6 bg-black text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
                                    New Arrivals 2026
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── MARQUEE TICKER ───────────────────────── */}
                <div className="bg-black text-white py-3 overflow-hidden relative">
                    <div className="flex whitespace-nowrap animate-marquee">
                        {Array(8).fill(null).map((_, i) => (
                            <span key={i} className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest mx-6">
                                FASHION <span className="text-yellow-400">✦</span> Snitch FASHION <span className="text-yellow-400">✦</span> Snitch FASHION <span className="text-yellow-400">✦</span>
                            </span>
                        ))}
                    </div>
                    <style>{`
            @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
            .animate-marquee { animation: marquee 18s linear infinite; width: max-content; }
          `}</style>
                </div>

                {/* ── FEATURED GRID ────────────────────────── */}
                <section className="max-w-[1200px] mx-auto px-6 py-16">
                    <div className="grid grid-cols-12 gap-4 h-[520px]">
                        {/* Large left card */}
                        <div className="col-span-12 md:col-span-5 relative rounded-xl overflow-hidden bg-[#e8e4dc] group cursor-pointer">
                            <img
                                src={newArrival}
                                alt="Women Collection"
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute bottom-6 left-6">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">Women Collection</p>
                                <h3 className="text-xl font-black text-gray-900 mb-3">Stylish Winter<br />T-Shirt for Woman</h3>
                                <button onClick={() => navigate('/explore')} className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition">
                                    Explore Now
                                </button>
                            </div>
                        </div>

                        {/* Middle card */}
                        <div className="col-span-12 md:col-span-4 relative rounded-xl overflow-hidden bg-[#2c2c2c] group cursor-pointer">
                            <img
                                src={women}
                                alt="New Arrivals"
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute bottom-6 left-6">
                                <button onClick={() => navigate('/explore')} className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-yellow-400 transition">
                                    Explore Now
                                </button>
                            </div>
                        </div>

                        {/* Right stacked cards */}
                        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                            {/* Women Winter */}
                            <div className="flex-1 relative rounded-xl overflow-hidden bg-[#f0ece5] group cursor-pointer flex items-center">
                                <div className="p-4 flex-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Women Collection</p>
                                    <h3 className="text-sm font-black text-gray-900 mb-2">Stylish Winter T-Shirt for Woman</h3>
                                    <button onClick={() => navigate('/explore')} className="px-3 py-1.5 border border-gray-900 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition">
                                        Check Now
                                    </button>
                                </div>
                                <img
                                    src={womentTshirt}
                                    alt="Women"
                                    className="w-24 h-full object-cover"
                                />
                            </div>

                            {/* Men Winter */}
                            <div className="flex-1 relative rounded-xl overflow-hidden bg-[#edf0f5] group cursor-pointer flex items-center">
                                <div className="p-4 flex-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Men Collection</p>
                                    <h3 className="text-sm font-black text-gray-900 mb-2">Stylish Winter Shirt for Man</h3>
                                    <button onClick={() => navigate('/explore')} className="px-3 py-1.5 border border-gray-900 text-[10px] font-bold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition">
                                        Check Now
                                    </button>
                                </div>
                                <img
                                    src={menTshirt}
                                    alt="Men"
                                    className="w-24 h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── OUR COLLECTION / CATEGORIES ─────────── */}
                <section className="max-w-[1200px] mx-auto px-6 pb-16">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-gray-900 leading-tight">
                            Our Collection
                        </h2>
                        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                            Step into the world of Snitch, where each collection tells its own story. From minimalist essentials to statement pieces, our fashion collections are designed to suit every occasion and style.
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-3 flex-wrap mb-10">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.label}
                                onClick={() => setActiveCategory(cat.label)}
                                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition ${activeCategory === cat.label
                                    ? 'bg-black text-white'
                                    : 'border border-gray-300 text-gray-700 hover:border-black'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Flash Sale Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {flashList.map(p => {
                            const prod = mapProduct(p, true);
                            return (
                                <div
                                    key={prod.id}
                                    onClick={() => prod.isReal && navigate(`/product/${prod.id}`)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative bg-gray-100 rounded-xl aspect-[3/4] overflow-hidden mb-3">
                                        <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-400" />

                                        {/* Add to cart overlay */}
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button className="w-36 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-yellow-400 transition">
                                                Add to Cart
                                            </button>
                                            <button className="w-36 py-2 border border-white text-white text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition">
                                                Buy Now
                                            </button>
                                        </div>

                                        {/* Wishlist */}
                                        <button
                                            onClick={e => e.stopPropagation()}
                                            className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow hover:text-red-500 transition"
                                        >
                                            <HeartIcon />
                                        </button>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{prod.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-black text-base">{prod.price}</span>
                                        {prod.oldPrice && <span className="text-xs text-red-400 line-through">{prod.oldPrice}</span>}
                                    </div>
                                    {/* Progress */}
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-black rounded-full transition-all" style={{ width: `${(prod.sold / prod.total) * 100}%` }} />
                                        </div>
                                        <span>{prod.sold}/{prod.total} Sold</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ── FLASH SALE COUNTDOWN ─────────────────── */}
                <section className="bg-[#f5f4f0] py-6 px-6">
                    <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-9 h-9 bg-black text-white rounded flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-lg md:text-xl font-black uppercase tracking-wide">Flash Sale Ends In</h2>
                            <div className="flex gap-1.5 items-center font-black text-sm md:text-base">
                                <span className="bg-black text-white rounded px-2.5 py-1">{pad(countdown.h)}</span>
                                <span>:</span>
                                <span className="bg-black text-white rounded px-2.5 py-1">{pad(countdown.m)}</span>
                                <span>:</span>
                                <span className="bg-black text-white rounded px-2.5 py-1">{pad(countdown.s)}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-9 h-9 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white transition text-sm">&larr;</button>
                            <button className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition text-sm">&rarr;</button>
                        </div>
                    </div>
                </section>

                {/* ── TODAY'S FOR YOU ──────────────────────── */}
                <section className="max-w-[1200px] mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-gray-900">Today's For You!</h2>
                        <div className="flex flex-wrap gap-2">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition ${activeTab === tab
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-gray-600 border-gray-300 hover:border-black'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {todayList.map((p, idx) => {
                            const prod = mapProduct(p);
                            return (
                                <div
                                    key={prod.id || idx}
                                    onClick={() => prod.isReal && navigate(`/product/${prod.id}`)}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition cursor-pointer group overflow-hidden"
                                >
                                    <div className="relative bg-gray-100 aspect-[4/3] overflow-hidden">
                                        <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-400" />
                                        {prod.tag && (
                                            <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold uppercase px-2 py-1 tracking-widest">
                                                {prod.tag}
                                            </span>
                                        )}
                                        <button
                                            onClick={e => e.stopPropagation()}
                                            className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow hover:text-red-500 transition"
                                        >
                                            <HeartIcon />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 h-10">{prod.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                            <span className="text-yellow-400 text-base leading-none">★</span>
                                            <span>{prod.rating}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <span>{prod.soldLabel} Sold</span>
                                        </div>
                                        <div className="font-black text-base text-gray-900">{prod.price}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ── CLOTH & FOOTWEAR BANNER ───────────────── */}
                <section className="relative bg-[#1a1a1a] text-white py-24 px-6 text-right overflow-hidden">
                    <div className="absolute inset-0 opacity-30 bg-[url('https://placehold.co/1200x400/111/222?text=')] bg-cover bg-center" />
                    <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 text-left">
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Step Into</p>
                            <p className="text-sm text-gray-400 max-w-xs">
                                I Snitch, we offer more than just clothing and footwear — we provide a canvas for your individuality. Our thoughtfully designed apparel and footwear collections stand style and comfort, allowing you to make a statement with every step.
                            </p>
                        </div>
                        <div className="flex-1 text-right">
                            <h2 className="text-5xl md:text-7xl font-black uppercase leading-tight text-white">
                                CLOTH AND<br />FOOTWEAR<br />COLLECTION
                            </h2>
                        </div>
                    </div>
                </section>

                {/* ── CLOTHING COLLECTION (dark) ────────────── */}
                <section className="bg-[#111] text-white py-16 px-6">
                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 flex justify-center">
                            <div className="w-full max-w-sm aspect-[3/4] bg-gray-800 rounded-xl overflow-hidden">
                                <img
                                    src={womentTshirt}
                                    alt="Clothing"
                                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition duration-500"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">Discover</p>
                            <h2 className="text-5xl md:text-6xl font-black uppercase leading-tight text-white mb-6">
                                CLOTHING<br />COLLECTION
                            </h2>
                            <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-sm">
                                Explore our curated clothing collection — designed for the modern individual who refuses to blend in. From statement outerwear to everyday essentials, every piece tells a story.
                            </p>
                            <button onClick={() => navigate('/explore')} className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 transition">
                                Explore Collection
                            </button>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
};

export default Home;