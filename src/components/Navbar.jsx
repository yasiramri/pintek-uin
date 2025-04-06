// File: src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/Logo-Pintek-outer-glow.png"
              alt="Lokal Influencer"
              className="h-10"
            />
          </Link>

          {/* Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-x-6">
            <Link to="/" className="nav-link">
              Home
            </Link>

            <div className="relative group">
              <Link
                to="/tentangkami"
                className="nav-link flex items-center gap-1 leading-none cursor-pointer"
              >
                <span className="flex items-center gap-1">
                  Tentang Kami
                  <ChevronDownIcon className="w-4 h-4 relative top-[1px] text-current" />
                </span>
              </Link>

              <div className="absolute left-0 top-full w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden group-hover:block">
                <Link to="/tentangkami#visi-misi" className="dropdown-item">
                  Visi Misi
                </Link>
                <Link
                  to="/tentangkami#salam-direktur"
                  className="dropdown-item"
                >
                  Salam Direktur
                </Link>
                <Link to="/struktur-organisasi" className="dropdown-item">
                  Struktur Organisasi
                </Link>
              </div>
            </div>

            <Link to="/news" className="nav-link">
              Artikel
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/" className="nav-link block">
            Home
          </Link>
          <div className="border-t pt-2">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full text-left nav-link"
            >
              Tentang Kami
            </button>
            {dropdownOpen && (
              <div className="pl-4 mt-2 space-y-1">
                <Link to="/#visi-misi" className="block text-sm text-gray-600">
                  Visi Misi
                </Link>
                <Link
                  to="/salam-direktur"
                  className="block text-sm text-gray-600"
                >
                  Salam Direktur
                </Link>
                <Link
                  to="/struktur-organisasi"
                  className="block text-sm text-gray-600"
                >
                  Struktur Organisasi
                </Link>
              </div>
            )}
          </div>
          <Link to="/news" className="nav-link block">
            News
          </Link>
          <Link to="/contact" className="nav-link block">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
