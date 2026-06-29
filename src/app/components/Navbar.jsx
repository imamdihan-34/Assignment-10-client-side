"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const isActive = (href) =>
    pathname === href
      ? "text-blue-600 font-bold bg-blue-50/60 md:bg-transparent px-3 py-2 md:p-0 rounded-lg"
      : "text-gray-600 hover:text-blue-600 font-medium";

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LegalEase
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`transition-colors duration-200 text-sm ${isActive("/")}`}
            >
              Home
            </Link>
            <Link
              href="/browse-lawyers"
              className={`transition-colors duration-200 text-sm ${isActive("/browse-lawyers")}`}
            >
              Browse Lawyers
            </Link>

            {user && (
              <div className="relative group py-2">
                <button className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm font-semibold flex items-center gap-1.5 focus:outline-none">
                  Dashboard
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block transition-all duration-300 overflow-hidden z-50">
                  <div className="py-1 bg-gray-50/50 px-4 py-2 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Role: {user.role}
                    </p>
                  </div>
                  <div className="p-1">
                    {user.role === "user" && (
                      <>
                        <Link
                          href="/dashboard/user/hiring-history"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        >
                          Hiring History
                        </Link>
                        <Link
                          href="/dashboard/user/update-profile"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        >
                          Update Profile
                        </Link>
                        <Link
                          href="/dashboard/user/comments"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        >
                          Comments
                        </Link>
                      </>
                    )}
                    {user.role === "lawyer" && (
                      <>
                        <Link
                          href="/dashboard/lawyer/hiring-history"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        >
                          Hiring Requests
                        </Link>
                        <Link
                          href="/dashboard/lawyer/manage-legal-profile"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        >
                          Manage Services
                        </Link>
                      </>
                    )}
                    {user.role === "admin" && (
                      <>
                        <Link
                          href="/dashboard/admin/manage-users"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        >
                          Manage Users
                        </Link>
                        <Link
                          href="/dashboard/admin/all-transactions"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        >
                          Transactions
                        </Link>
                        <Link
                          href="/dashboard/admin/analytics"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        >
                          Analytics
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200">
                  Hi, {user.name || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-100"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-3 shadow-inner">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
          >
            Home
          </Link>
          <Link
            href="/browse-lawyers"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
          >
            Browse Lawyers
          </Link>

          {user && (
            <div className="bg-gray-50 rounded-xl p-3 my-2 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
                Dashboard ({user.role})
              </p>
              {user.role === "user" && (
                <div className="space-y-1">
                  <Link
                    href="/dashboard/user/hiring-history"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                  >
                    Hiring History
                  </Link>
                  <Link
                    href="/dashboard/user/update-profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                  >
                    Update Profile
                  </Link>
                  <Link
                    href="/dashboard/user/comments"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                  >
                    Comments
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition shadow-sm text-center"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
