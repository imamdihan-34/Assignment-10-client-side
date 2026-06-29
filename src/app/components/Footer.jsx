'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#111827] text-gray-300 pt-16 pb-8 mt-20 border-t border-gray-800 flex justify-center">
      {/* max-w-7xl mx-auto নিশ্চিত করে ফুটার কন্টেন্ট স্ক্রিনের মাঝখানে থাকবে, কোনায় ছড়াবে না */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-gray-800">
          
          {/* 1. About Section */}
          <div className="flex flex-col space-y-4">
            <span className="text-2xl font-black tracking-tight text-white">
              Legal<span className="text-blue-500">Ease</span>
            </span>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Connecting trusted legal professionals with clients who need their expertise. Making judicial consultation smooth, reliable, and accessible for everyone.
            </p>
          </div>

          {/* 2. Quick Links Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide">Quick Links</h3>
            <ul className="grid grid-cols-1 gap-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-1">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse-lawyers" className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-1">
                  Browse Lawyers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-1">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-1">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Social Media Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-white tracking-wide">Follow Our Journey</h3>
            <p className="text-sm text-gray-400">Stay updated through our social handles:</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-800/60 border border-gray-700/50 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 text-lg font-semibold">
                f
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-800/60 border border-gray-700/50 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 text-base font-bold">
                𝕏
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-800/60 border border-gray-700/50 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 text-lg font-semibold">
                in
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section: Newsletter Form (Fixing the layout crash) */}
        <div className="w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-800/80 p-6 sm:p-8 rounded-2xl my-12 text-center shadow-xl">
          <h3 className="text-xl font-bold text-white mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">Get legal insights, case updates, and professional advice delivered directly to your inbox.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full flex-grow px-4 py-3 rounded-xl bg-gray-950/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
              required
            />
            <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 text-sm shadow-lg shadow-blue-600/10 flex-shrink-0">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-4 text-center text-xs text-gray-500 font-medium">
          <p>&copy; {new Date().getFullYear()} LegalEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}