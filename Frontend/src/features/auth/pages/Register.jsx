import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth";
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Register = () => {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        password: '',
        isSeller: false
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await handleRegister({
                email: formData.email,
                contact: formData.contactNumber,
                password: formData.password,
                isSeller: formData.isSeller,
                fullname: formData.fullName
            });
            navigate("/");
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };

    const fields = [
        { id: 'fullName',       label: 'Full Name',       type: 'text',     placeholder: 'John Doe' },
        { id: 'contactNumber',  label: 'Contact Number',  type: 'tel',      placeholder: '+91 98765 43210' },
        { id: 'email',          label: 'Email Address',   type: 'email',    placeholder: 'hello@example.com' },
        { id: 'password',       label: 'Password',        type: showPassword ? 'text' : 'password', placeholder: '••••••••' },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

                .Snitch-input {
                    background: transparent;
                    border: none;
                    border-bottom: 1.5px solid #d4d4d4;
                    outline: none;
                    width: 100%;
                    padding: 12px 0;
                    font-size: 13px;
                    font-family: 'DM Sans', sans-serif;
                    color: #111;
                    transition: border-color 0.2s;
                }
                .Snitch-input:focus {
                    border-bottom-color: #111;
                }
                .Snitch-input::placeholder {
                    color: #aaa;
                }
                .marquee-track {
                    display: flex;
                    width: max-content;
                    animation: marquee-up 14s linear infinite;
                }
                @keyframes marquee-up {
                    from { transform: translateY(0); }
                    to   { transform: translateY(-50%); }
                }
                .btn-submit {
                    position: relative;
                    overflow: hidden;
                    background: #111;
                    color: #fff;
                    transition: color 0.3s;
                }
                .btn-submit::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: #fff;
                    transform: translateX(-101%);
                    transition: transform 0.35s cubic-bezier(.4,0,.2,1);
                    z-index: 0;
                }
                .btn-submit:hover::after { transform: translateX(0); }
                .btn-submit:hover { color: #111; }
                .btn-submit span { position: relative; z-index: 1; }
            `}</style>

            <div className="min-h-screen flex flex-row" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: '#f8f8f6' }}>

                {/* ── LEFT: Editorial Panel ─────────────────────── */}
                <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden bg-[#111] flex-col">

                    {/* Vertical marquee text in background */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.04] pointer-events-none select-none">
                        <div className="marquee-track flex-col text-white text-[7rem] font-black uppercase leading-none tracking-tighter"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", writingMode: 'vertical-rl' }}>
                            {Array(6).fill('Snitch FASHION ').map((t, i) => <span key={i}>{t}</span>)}
                            {Array(6).fill('Snitch FASHION ').map((t, i) => <span key={`b${i}`}>{t}</span>)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full p-12 xl:p-16">

                        {/* Top: Logo */}
                        <div>
                            <span className="text-white text-xl font-black uppercase tracking-[0.2em]"
                                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.25em' }}>
                                Snitch
                            </span>
                        </div>

                        {/* Middle: Hero text */}
                        <div className="flex-1 flex flex-col justify-center">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-6">New Member</p>
                            <h2 className="text-7xl xl:text-8xl font-black uppercase leading-[0.88] text-white mb-8"
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                JOIN<br/>THE<br/>Snitch<br/>WORLD
                            </h2>
                            <p className="text-xs text-gray-500 leading-relaxed max-w-[220px]">
                                Join the exclusive movement of creators and brands redefining the modern fashion landscape.
                            </p>
                        </div>

                        {/* Bottom: Stats */}
                        <div className="flex gap-8 border-t border-gray-800 pt-8">
                            {[['50K+', 'Members'], ['200+', 'Brands'], ['98%', 'Satisfaction']].map(([num, label]) => (
                                <div key={label}>
                                    <p className="text-white font-black text-lg mb-0.5"
                                        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em', fontSize: '1.5rem' }}>
                                        {num}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-600">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom image strip */}
                    <div className="absolute bottom-0 right-0 w-48 h-64 opacity-20">
                        <img
                            src="/snitch_editorial_warm.png"
                            alt=""
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                </div>

                {/* ── RIGHT: Form Panel ─────────────────────────── */}
                <div className="w-full lg:w-[55%] xl:w-[58%] flex items-center justify-center min-h-screen px-6 sm:px-12 lg:px-16 xl:px-24 py-14 bg-[#f8f8f6] overflow-y-auto">
                    <div className="w-full max-w-[400px]">

                        {/* Mobile logo */}
                        <div className="lg:hidden mb-10">
                            <span className="text-2xl font-black uppercase tracking-[0.2em] text-gray-900"
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                Snitch
                            </span>
                        </div>

                        {/* Header */}
                        <div className="mb-10">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-gray-400 font-medium mb-3">
                                Create Account
                            </p>
                            <h1 className="text-4xl xl:text-5xl font-black uppercase leading-tight text-gray-900"
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                Sign Up
                            </h1>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-xs text-red-600 uppercase tracking-wider">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-7">

                            {fields.map(({ id, label, type, placeholder }) => (
                                <div key={id} className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor={`reg-${id}`}
                                        className="text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors"
                                        style={{ color: focused === id ? '#111' : '#999' }}
                                    >
                                        {label}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id={`reg-${id}`}
                                            type={type}
                                            name={id}
                                            value={formData[id]}
                                            onChange={handleChange}
                                            required
                                            placeholder={placeholder}
                                            className="Snitch-input"
                                            onFocus={() => setFocused(id)}
                                            onBlur={() => setFocused('')}
                                        />
                                        {/* Show/hide password toggle */}
                                        {id === 'password' && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(p => !p)}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider text-gray-400 hover:text-gray-900 transition"
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Seller checkbox */}
                            <label htmlFor="reg-isSeller" className="flex items-center gap-3 cursor-pointer group select-none">
                                <div
                                    className="w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                    style={{
                                        borderColor: formData.isSeller ? '#111' : '#ccc',
                                        backgroundColor: formData.isSeller ? '#111' : 'transparent',
                                    }}
                                >
                                    {formData.isSeller && (
                                        <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                    <input
                                        id="reg-isSeller"
                                        type="checkbox"
                                        name="isSeller"
                                        checked={formData.isSeller}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                </div>
                                <span className="text-[11px] uppercase tracking-[0.18em] font-medium transition-colors"
                                    style={{ color: formData.isSeller ? '#111' : '#999' }}>
                                    Register as Seller
                                </span>
                            </label>

                            {/* Submit */}
                            <button type="submit" className="btn-submit w-full py-4 mt-1 border border-black">
                                <span className="text-[11px] uppercase tracking-[0.28em] font-semibold">
                                    Create Account
                                </span>
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-gray-200"/>
                                <span className="text-[10px] uppercase tracking-widest text-gray-400">or</span>
                                <div className="flex-1 h-px bg-gray-200"/>
                            </div>

                            {/* Google */}
                            <ContinueWithGoogle />

                            {/* Sign in link */}
                            <p className="text-center text-[11px] text-gray-400">
                                Already have an account?{' '}
                                <a
                                    href="/login"
                                    className="text-gray-900 font-semibold uppercase tracking-wider underline underline-offset-4 hover:text-gray-500 transition"
                                >
                                    Sign In
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;