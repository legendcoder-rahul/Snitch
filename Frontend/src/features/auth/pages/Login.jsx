import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth'

const Login = () => {
  const { handleLogin } = useAuth()
  const { error, loading } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await handleLogin({
      email: form.email,
      password: form.password,
    })
    
    if (result.success) {
      navigate('/')
    }
  }

  // Display user-friendly error message for wrong password
  const displayError = error ? 'Invalid password' : null

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">

      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-5 border-b border-white/5">
        <span className="text-xl font-bold tracking-tight text-[#d4a017]">Snitch</span>
        <nav className="flex items-center gap-8 text-sm text-white/50">
          <a href="#" className="hover:text-white/80 transition-colors">Features</a>
          <a href="#" className="hover:text-white/80 transition-colors">About</a>
          <Link to="/register" className="text-[#d4a017] hover:text-[#e6b820] transition-colors font-medium">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.22em] uppercase text-white/30 mb-3">Welcome Back</p>
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">Sign In</h1>
          <p className="text-sm text-white/40">Enter your credentials to access your account.</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-xl bg-[#161616] border border-white/[0.07] rounded-2xl px-10 py-11 shadow-2xl">

          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4a017]/60 to-transparent mb-9" />

          {displayError && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-7">

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[10px] tracking-[0.18em] uppercase text-white/35 font-medium">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@snitch.com"
                value={form.email}
                onChange={handleChange}
                className="bg-transparent border-b border-white/15 py-3 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-[#d4a017]/70 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[10px] tracking-[0.18em] uppercase text-white/35 font-medium">
                Password
              </label>
              <div className="relative flex items-center border-b border-white/15 focus-within:border-[#d4a017]/70 transition-colors">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 bg-transparent py-3 text-base text-white placeholder:text-white/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/30 hover:text-white/60 transition-colors ml-2"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-7s4.477-7 10-7a9.956 9.956 0 015.875 1.875M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-3.364l-14.728 14.728" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4a017] hover:bg-[#e6b820] active:bg-[#bf9015] disabled:cursor-not-allowed disabled:opacity-70 text-black font-semibold text-sm py-4 rounded-xl transition-colors tracking-wide mt-1"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

          </form>

          {/* Sign Up */}
          <p className="text-center text-sm text-white/30 mt-7">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#d4a017] hover:text-[#e6b820] transition-colors font-medium">
              Sign up
            </Link>
          </p>

          {/* Bottom accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mt-8" />
        </div>

      </main>

      {/* Footer */}
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

export default Login
