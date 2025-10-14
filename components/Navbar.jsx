"use client"
import React, { useState, useEffect, useRef } from "react";
import { assets} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {

  const { isSeller, router, unreadCount } = useAppContext();
  const { isSignedIn, user } = useUser();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="relative flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-3 border-b border-gray-300 text-gray-700 bg-white">
        {/* Logo */}
        <Image
          className="cursor-pointer w-24 sm:w-28 md:w-32 lg:w-36"
          onClick={() => router.push('/')}
          src={assets.logo}
          alt="logo"
        />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link href="/" className="hover:text-gray-900 transition text-sm xl:text-base font-medium">
            Home
          </Link>
          <Link href="/all-products" className="hover:text-gray-900 transition text-sm xl:text-base font-medium">
            Shop
          </Link>
          <Link href="/" className="hover:text-gray-900 transition text-sm xl:text-base font-medium">
            About Us
          </Link>
          <Link href="/" className="hover:text-gray-900 transition text-sm xl:text-base font-medium">
            Contact
          </Link>
          {isSeller && (
            <button 
              onClick={() => router.push('/seller')} 
              className="relative text-xs xl:text-sm border border-orange-600 text-orange-600 px-3 xl:px-4 py-1.5 xl:py-2 rounded-full hover:bg-orange-600 hover:text-white transition"
            >
              Seller Dashboard
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <Image className="w-4 h-4 xl:w-5 xl:h-5" src={assets.search_icon} alt="search icon" />
          {isSignedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-2 hover:text-gray-900 transition px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
                <span className="text-sm font-medium">Account</span>
                <svg className={`w-4 h-4 transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 xl:w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                  </div>
                  <Link 
                    href="/my-orders" 
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setIsAccountDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </Link>
                  <Link 
                    href="/add-address" 
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    onClick={() => setIsAccountDropdownOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Addresses
                  </Link>
                  <div className="border-t border-gray-100 px-4 py-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 hover:text-gray-900 transition px-3 py-2 rounded-lg hover:bg-gray-100">
                  <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden gap-2">
          {isSeller && (
            <button 
              onClick={() => router.push('/seller')} 
              className="relative text-xs border border-orange-600 text-orange-600 px-2 py-1 rounded-full hover:bg-orange-600 hover:text-white transition"
            >
              Seller
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg" ref={mobileMenuRef}>
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block py-2 text-gray-700 hover:text-gray-900 transition font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/all-products" 
                className="block py-2 text-gray-700 hover:text-gray-900 transition font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/" 
                className="block py-2 text-gray-700 hover:text-gray-900 transition font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/" 
                className="block py-2 text-gray-700 hover:text-gray-900 transition font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-4">
              {isSignedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Image src={assets.user_icon} alt="user icon" className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                  </div>
                  <Link 
                    href="/my-orders" 
                    className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </Link>
                  <Link 
                    href="/add-address" 
                    className="flex items-center gap-3 py-3 text-gray-700 hover:text-gray-900 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Addresses
                  </Link>
                  <div className="pt-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <SignInButton mode="modal">
                    <button className="w-full flex items-center justify-center gap-2 py-3 px-4 text-gray-700 hover:text-gray-900 transition border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
                      <span className="font-medium">Sign In</span>
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition font-medium">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;