import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { useProduct } from '../hooks/useProduct.js'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR']
const MAX_IMAGES = 7

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  })

  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageAdd = (files) => {
    const fileArray = Array.from(files)
    const remaining = MAX_IMAGES - images.length
    const toAdd = fileArray.slice(0, remaining)

    if (toAdd.length === 0) return

    const newImages = [...images, ...toAdd]
    setImages(newImages)

    toAdd.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleImageAdd(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files) {
      handleImageAdd(e.target.files)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Product title is required.')
      return
    }
    if (!form.priceAmount || Number(form.priceAmount) <= 0) {
      setError('Please enter a valid price.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('priceAmount', form.priceAmount)
      formData.append('priceCurrency', form.priceCurrency)
      images.forEach((img) => formData.append('images', img))

      await handleCreateProduct(formData)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">

      {/* ── Navbar ── */}
      <header className="flex items-center justify-between px-10 py-5 border-b border-white/5">
        <Link to="/" className="text-xl font-bold tracking-tight text-[#d4a017]">
          Snitch
        </Link>
        <nav className="flex items-center gap-8 text-[10px] tracking-[0.18em] uppercase text-white/40 font-medium">
          <a href="#" className="hover:text-white/70 transition-colors">Dashboard</a>
          <a href="#" className="text-[#d4a017] hover:text-[#e6b820] transition-colors">Products</a>
          <a href="#" className="hover:text-white/70 transition-colors">Orders</a>
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/25 mb-3 font-semibold">
            New Listing
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Create Product
          </h1>
          <p className="text-sm text-white/35">
            Add your product to the marketplace.
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-2xl bg-[#161616] border border-white/[0.07] rounded-2xl px-8 md:px-10 py-10 md:py-11 shadow-2xl">

          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4a017]/60 to-transparent mb-10" />

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* ── Title ── */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="title"
                className="text-[10px] tracking-[0.18em] uppercase text-white/35 font-medium"
              >
                Product Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter product title"
                value={form.title}
                onChange={handleChange}
                className="bg-transparent border-b border-white/15 py-3 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4a017]/70 transition-colors"
              />
            </div>

            {/* ── Description ── */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-[10px] tracking-[0.18em] uppercase text-white/35 font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe your product in detail..."
                value={form.description}
                onChange={handleChange}
                className="bg-transparent border-b border-white/15 py-3 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4a017]/70 transition-colors resize-none"
              />
            </div>

            {/* ── Price Section ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Price Amount */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="priceAmount"
                  className="text-[10px] tracking-[0.18em] uppercase text-white/35 font-medium"
                >
                  Price Amount
                </label>
                <input
                  id="priceAmount"
                  name="priceAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.priceAmount}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white/15 py-3 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4a017]/70 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Price Currency */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="priceCurrency"
                  className="text-[10px] tracking-[0.18em] uppercase text-white/35 font-medium"
                >
                  Currency
                </label>
                <select
                  id="priceCurrency"
                  name="priceCurrency"
                  value={form.priceCurrency}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white/15 py-3 text-base text-white focus:outline-none focus:border-[#d4a017]/70 transition-colors cursor-pointer appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0 center',
                    backgroundSize: '1.25rem',
                  }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c} className="bg-[#161616] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Image Upload ── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] tracking-[0.18em] uppercase text-white/35 font-medium">
                  Product Images
                </label>
                <span className="text-[10px] tracking-[0.18em] uppercase text-white/25 font-medium">
                  {images.length}/{MAX_IMAGES}
                </span>
              </div>

              {/* Drop Zone */}
              {images.length < MAX_IMAGES && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    flex flex-col items-center justify-center gap-3 py-10 
                    border-2 border-dashed rounded-xl cursor-pointer
                    transition-all duration-300
                    ${isDragging
                      ? 'border-[#d4a017]/60 bg-[#d4a017]/5'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                    }
                  `}
                >
                  {/* Cloud Upload Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 transition-colors ${isDragging ? 'text-[#d4a017]/60' : 'text-white/20'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="text-center">
                    <p className="text-sm text-white/40">Click or drag images here</p>
                    <p className="text-[11px] text-white/20 mt-1">PNG, JPG, WEBP up to 5MB each</p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-1">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={src}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleImageRemove(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500/90 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Empty Slots */}
                  {Array.from({ length: MAX_IMAGES - imagePreviews.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-lg border border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty placeholder slots when no images */}
              {imagePreviews.length === 0 && (
                <div className="flex flex-wrap gap-3 mt-1">
                  {Array.from({ length: MAX_IMAGES }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-lg border border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4a017] hover:bg-[#e6b820] active:bg-[#bf9015] disabled:cursor-not-allowed disabled:opacity-70 text-black font-semibold text-sm py-4 rounded-xl transition-colors tracking-wide mt-2"
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </button>

          </form>

          {/* Bottom accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mt-10" />
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="py-6 px-8 border-t border-white/[0.04] flex flex-col items-center gap-3">
        <div className="flex items-center gap-5 text-[11px] tracking-widest uppercase text-white/20">
          <a href="#" className="hover:text-white/40 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/40 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white/40 transition-colors">Help Center</a>
        </div>
        <p className="text-[10px] text-white/15">© 2025 Snitch. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default CreateProduct