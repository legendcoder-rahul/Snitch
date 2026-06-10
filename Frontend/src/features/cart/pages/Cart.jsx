import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'
import { Link, useNavigate } from 'react-router'
import { useRazorpay } from 'react-razorpay'

const Cart = () => {
    const cart = useSelector(state => state.cart)
    const { handleGetCart, handleIncrementCartItem } = useCart()
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const { error, isLoading, Razorpay } = useRazorpay();

    const [quantities, setQuantities] = useState({})

    useEffect(() => {
        handleGetCart()
    }, [])

    // Sync quantities from server data
    useEffect(() => {
        if (cart?.items?.length) {
            const qMap = {}
            cart.items.forEach(item => {
                const key = item._id || item.product?._id
                if (key) qMap[key] = item.quantity ?? 1
            })
            setQuantities(qMap)
        }
    }, [cart?.items])

    const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: 50000, // Amount in paise
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      order_id: "order_9A33XWu170gUtm", // Generate order_id on server
      handler: (response) => {
        console.log(response);
        alert("Payment Successful!");
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };


    const changeQty = (id, delta) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] ?? 1) + delta),
        }))
    }

    const getDisplayImage = (product, variant) => {
        if (variant?.images?.length) return variant.images[0].url
        if (product?.images?.length) return product.images[0].url
        return null
    }

    const formatCurrency = (amount, currency = 'INR') =>
        `${currency} ${Number(amount || 0).toLocaleString('en-IN')}`

    // Calculate subtotal from items
    const subtotal = (cart?.items || []).reduce((sum, item) => {
        const key = item._id || item.product?._id
        const qty = quantities[key] ?? item.quantity ?? 1
        // Try variant price first, then item price, then product price
        const variant = item.product?.variants?.find(v => v._id === item.variant)
        const price = variant?.price?.amount ?? item.price?.amount ?? item.product?.price?.amount ?? 0
        return sum + (price * qty)
    }, 0)

    const currency = cart?.items?.[0]?.price?.currency
        || cart?.items?.[0]?.product?.price?.currency
        || 'INR'

  

    /* ─── Empty state ─── */
    if (!cart?.items?.length) {
        return (
            <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
                <div className="flex flex-col items-center justify-center gap-6 py-32 px-6">
                    {/* Empty cart icon */}
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-gray-900">Your Cart is Empty</h2>
                    <p className="text-sm text-gray-500 max-w-sm text-center">
                        Looks like you haven't added anything to your cart yet. Explore our collection and find something you love.
                    </p>
                    <Link
                        to="/"
                        className="px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
            <div className="max-w-[1200px] mx-auto px-6 py-10 lg:py-16">

                {/* ── Page Header ── */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 mb-1">
                        Shopping Cart
                    </h1>
                    <p className="text-xs text-gray-500">
                        {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

                    {/* ═══ LEFT: Cart Items ═══ */}
                    <div className="w-full lg:w-[65%]">
                        <div className="flex flex-col gap-0">
                            {cart.items.map((item, idx) => {
                                const { product, variant: variantId, price } = item
                                const variantDetail = product?.variants?.find(v => v._id === variantId)
                                const imageUrl = getDisplayImage(product, variantDetail)
                                const displayPrice = variantDetail?.price ?? price ?? product?.price
                                const key = item._id || product?._id
                                const qty = quantities[key] ?? item.quantity ?? 1
                                const attributes = variantDetail?.attributes ?? {}
                                const stock = variantDetail?.stock
                                const lineTotal = (displayPrice?.amount ?? 0) * qty

                                return (
                                    <div
                                        key={key + '-' + idx}
                                        className="flex gap-5 md:gap-6 py-6"
                                        style={{ borderBottom: '1px solid #f0f0f0' }}
                                    >
                                        {/* Image */}
                                        <div
                                            className="flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                                            style={{ width: 'clamp(90px, 14vw, 140px)', aspectRatio: '4/5' }}
                                            onClick={() => navigate(`/product/${product?._id}`)}
                                        >
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={product?.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <h3
                                                    className="font-semibold text-gray-900 text-sm md:text-base mb-1 truncate cursor-pointer hover:underline"
                                                    onClick={() => navigate(`/product/${product?._id}`)}
                                                >
                                                    {product?.title}
                                                </h3>

                                                {/* Variant attributes */}
                                                {Object.keys(attributes).length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                                        {Object.entries(attributes).map(([k, val]) => (
                                                            <span
                                                                key={k}
                                                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded"
                                                            >
                                                                {k}: {val}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Price */}
                                                <p className="font-black text-base text-gray-900 mb-1">
                                                    {displayPrice ? formatCurrency(displayPrice.amount, displayPrice.currency) : '—'}
                                                </p>

                                                {/* Stock */}
                                                {stock !== undefined && (
                                                    <p className={`text-xs font-medium ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Bottom: Qty + Line total + Remove */}
                                            <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
                                                {/* Quantity Stepper */}
                                                <div className="flex items-center border border-gray-200 rounded-sm">
                                                    <button
                                                        onClick={() => changeQty(key, -1)}
                                                        className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 transition"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold text-gray-900 select-none">
                                                        {qty}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            changeQty(key, 1)
                                                            if (variantId && product?._id) {
                                                                handleIncrementCartItem(product._id, variantId)
                                                            }
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Line Total */}
                                                <span className="text-sm font-black text-gray-900">
                                                    {formatCurrency(lineTotal, displayPrice?.currency || currency)}
                                                </span>

                                                {/* Remove */}
                                                <button className="text-xs text-gray-400 hover:text-red-500 uppercase tracking-wider font-medium transition">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Policy strip */}
                        <div className="mt-8 pt-6 grid grid-cols-3 gap-4 text-[10px] uppercase tracking-wider text-gray-400"
                            style={{ borderTop: '1px solid #f0f0f0' }}>
                            <div>
                                <p className="font-bold text-gray-700 mb-1">Shipping</p>
                                <p>Free over ₹15,000</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-700 mb-1">Returns</p>
                                <p>Within 14 days</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-700 mb-1">Authenticity</p>
                                <p>100% Guaranteed</p>
                            </div>
                        </div>
                    </div>

                    {/* ═══ RIGHT: Order Summary ═══ */}
                    <div className="w-full lg:w-[35%] lg:sticky lg:top-28">
                        <div className="bg-[#f5f4f0] rounded-xl p-8">
                            <h2 className="text-xl font-black uppercase text-gray-900 mb-6">Order Summary</h2>

                            <div className="h-px bg-gray-200 mb-6" />

                            {/* Line items */}
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Subtotal</span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {formatCurrency(subtotal, currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Shipping</span>
                                    <span className={`text-xs uppercase tracking-wider ${subtotal >= 15000 ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                        {subtotal >= 15000 ? 'Free' : 'Calculated at checkout'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Taxes</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Included</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-200 mb-6" />

                            {/* Grand Total */}
                            <div className="flex justify-between items-baseline mb-8">
                                <span className="text-sm font-black uppercase tracking-wider text-gray-900">Total</span>
                                <span className="text-xl font-black text-gray-900">
                                    {formatCurrency(subtotal, currency)}
                                </span>
                            </div>

                            {/* CTAs */}
                            <button
                                onClick={handlePayment}
                                className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition mb-3"
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition"
                            >
                                Continue Shopping
                            </button>

                            <p className="mt-5 text-center text-[10px] text-gray-400 uppercase tracking-wider">
                                Free returns within 14 days · 100% authentic
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart