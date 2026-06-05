import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { setUser } from '../../auth/state/auth.slice';
import ProfileIcon from '../../../assets/ProfileIcon.png'

const Nav = () => {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        dispatch(setUser(null));
        navigate('/login');
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <header className="bg-white py-4 px-4 md:px-8 flex items-center justify-between shadow-sm sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <span className="text-xl font-bold tracking-tight">Snitch.com</span>
            </div>

            {/* Search Input Container - Hidden on small screens */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 border border-gray-300 rounded-lg overflow-hidden focus-within:border-black transition">
                <select className="bg-gray-100 text-gray-600 px-4 py-2 border-r outline-none text-xs md:text-sm">
                    <option>All Category</option>
                </select>
                <input
                    type="text"
                    placeholder="Search product or brand here..."
                    className="flex-1 px-4 py-2 outline-none text-xs md:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                />
                <button onClick={handleSearch} className="px-4 text-gray-500 hover:text-black">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2 md:gap-4 text-gray-600">
                {/* Cart Icon */}
                <button 
                    onClick={() => user ? navigate('/cart') : navigate('/login')}
                    className="hover:text-black p-1.5 md:p-2 rounded-full hover:bg-gray-100 transition relative"
                    title="Cart"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </button>

                {user ? (
                    <div className="flex items-center gap-2 md:gap-4">
                        {user.role === 'seller' && (
                            <button 
                                onClick={() => navigate('/seller/dashboard')}
                                className="text-xs md:text-sm font-semibold text-gray-700 hover:text-black px-2 md:px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
                            >
                                Dashboard
                            </button>
                        )}
                        <span className="text-xs md:text-sm font-medium text-gray-800 hidden sm:inline">
                            Hi, {user.fullname?.split(' ')[0]}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="bg-black text-white text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-full font-semibold hover:bg-red-600 hover:text-white transition duration-300"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link 
                            to="/login"
                            className="text-xs md:text-sm font-semibold text-gray-700 hover:text-black px-2 md:px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register"
                            className="bg-black text-white text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-full font-semibold hover:bg-gray-850 transition duration-300"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Nav;