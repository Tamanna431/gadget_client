'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Cpu, Menu, X, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const publicLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const privateLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore' },
    { label: 'Add Gadget', href: '/items/add' },
    { label: 'Manage', href: '/items/manage' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const links = user ? privateLinks : publicLinks;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Cpu className="text-primary group-hover:rotate-12 transition-transform" size={28} />
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              Gadget<span className="text-primary font-extrabold">Verse</span>
            </span>
          </Link>
 
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all py-1 ${
                  isActive(link.href)
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
 
          {/* Auth Buttons (Desktop) - ALWAYS VISIBLE */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <LogIn size={16} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition flex items-center gap-2"
                >
                  <LogIn size={16} />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 transition flex items-center gap-2 shadow-md shadow-primary/20"
                >
                  <UserPlus size={16} />
                  Register
                </Link>
              </>
            )}
          </div>
 
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
 
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200">
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-center text-sm font-medium text-white bg-red-500 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn size={16} />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition flex items-center justify-center gap-2"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 transition flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16} />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}