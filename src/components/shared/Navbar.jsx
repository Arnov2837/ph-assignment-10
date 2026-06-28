"use client";
import { useRouter } from "next/navigation";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBriefcase,
  FiSearch,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiGrid,
  FiChevronDown,
} from "react-icons/fi";
import { useAuth } from "../../providers/AuthProvider";

const navLinks = [
  { name: "Home", path: "/", icon: <FiHome className="text-xl" /> },
  {
    name: "Startups",
    path: "/startups",
    icon: <FiBriefcase className="text-xl" />,
  },
  {
    name: "Opportunities",
    path: "/opportunities",
    icon: <FiSearch className="text-xl" />,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowBottomNav(false);
      } else {
        setShowBottomNav(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  StartupForge
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="relative group flex items-center gap-2 text-base font-medium"
                  >
                    <span
                      className={`transition-colors duration-300 flex items-center gap-2 ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-600 group-hover:text-blue-600"
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </span>
                    <span
                      className={`absolute -bottom-7 left-0 w-full h-[3px] rounded-t-md transition-all duration-300 ${
                        isActive
                          ? "bg-blue-600 scale-x-100"
                          : "bg-blue-600 scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-5">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 shadow-sm transition-transform hover:scale-105"
                    />
                    <FiChevronDown
                      className={`hidden md:block text-gray-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 transform origin-top-right z-50 ${
                      isDropdownOpen
                        ? "opacity-100 scale-100 visible"
                        : "opacity-0 scale-95 invisible"
                    }`}
                  >
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiGrid className="text-lg" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 mt-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiLogOut className="text-lg" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden md:flex items-center gap-2 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FiLogIn className="text-xl" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="hidden md:flex items-center gap-2 px-6 py-2.5 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <FiUser className="text-xl" />
                    Register
                  </Link>
                  <Link
                    href="/login"
                    className="md:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-600 bg-gray-50 border border-gray-200 rounded-full shadow-sm"
                  >
                    <FiLogIn className="text-xl" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] z-50 transition-transform duration-500 ease-in-out ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-around items-center h-16 px-2 pb-safe">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <div
                  className={`p-1.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-blue-50 scale-110 shadow-sm"
                      : "bg-transparent scale-100"
                  }`}
                >
                  {link.icon}
                </div>
                <span
                  className={`text-[10px] font-semibold transition-all duration-300 ${isActive ? "opacity-100" : "opacity-70"}`}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
