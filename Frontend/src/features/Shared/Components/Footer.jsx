import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-gray-400">

      {/* CTA Banner */}
      <div className="bg-[#1a1a1a] py-14 px-6 text-center border-b border-gray-800">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Fashion Redefined</p>
        <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight tracking-tight mb-6">
          Cloth & Footwear<br/>Collection
        </h2>
        <button className="mt-2 px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition">
          Shop Now
        </button>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <p className="text-2xl font-black uppercase tracking-[0.2em] text-white mb-3">Snitch</p>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            A fashion experience that mirrors your unique personality. At Snitch, every piece is crafted to celebrate individuality and empower you to stand out effortlessly.
          </p>
          {/* Social */}
          <div className="flex gap-3">
            {[
              <path key="ig" d="M16.98 0a6.9 6.9 0 01.98 3.9 7 7 0 01-7 7 7 7 0 01-7-7c0-3.86 3.14-7 7-7a6.96 6.96 0 014.02 1.28L3.92 16H0V0h16.98zM7 12a5 5 0 100-10A5 5 0 007 12z"/>,
              <path key="fb" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>,
              <path key="tw" d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>,
              <path key="yt" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
            ].map((path, i) => (
              <a key={i} href="#" className="w-8 h-8 border border-gray-700 rounded flex items-center justify-center text-gray-500 hover:border-white hover:text-white transition">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">{path}</svg>
              </a>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Company</h4>
          <ul className="space-y-3">
            {['About Snitch', 'Careers', 'Press', 'Blog', 'Sustainability'].map(link => (
              <li key={link}>
                <a href="#" className="text-xs text-gray-500 hover:text-white transition">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Shop</h4>
          <ul className="space-y-3">
            {["Men's Collection", "Women's Collection", 'Footwear', 'Accessories', 'Sale'].map(link => (
              <li key={link}>
                <a href="#" className="text-xs text-gray-500 hover:text-white transition">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Support</h4>
          <ul className="space-y-3">
            {['FAQs', 'Size Guide', 'Shipping & Returns', 'Track Order', 'Contact Us'].map(link => (
              <li key={link}>
                <a href="#" className="text-xs text-gray-500 hover:text-white transition">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-gray-600">
          <p>© 2026 Snitch. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-gray-400 transition">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;