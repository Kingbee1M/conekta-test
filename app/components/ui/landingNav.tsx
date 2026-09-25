'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';

import logo from '@/public/png/logofinal.png';

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Define paths where the navbar should be hidden
  const excludedRoutes = [
    '/login',
    '/log-in',
    '/sign-up',
    '/register',
    '/get-started',
    '/blog',
    '/terms-and-policy'
  ];

  // Check if current route matches or starts with any excluded route
  const isExcluded = excludedRoutes.some((route) => pathname?.startsWith(route));

  // Do not render the navbar on excluded pages
  if (isExcluded) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Product', href: '/discover' },
    { name: 'Impact', href: '/impact' },
    { name: 'Team', href: '/about-us#team' },
    { name: 'Login', href: '/log-in' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-4 inset-x-0 z-50 max-w-7xl mx-auto px-4 w-full"
    >
      <div className="w-full flex items-center justify-between px-5 py-2.5 bg-slate-100/80 backdrop-blur-md border border-slate-200/80 rounded-full shadow-sm transition-all duration-300">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={logo}
            alt="Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="text-lg sm:text-xl font-extrabold tracking-wider text-slate-900 uppercase">
            CONEKTA
          </span>
        </Link>

        {/* Floating Pill Nav (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-200/60 border border-slate-300/50 p-1 rounded-full shadow-xs">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Action Button (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-up"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <span className='text-xs'>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-full bg-slate-200/60 border border-slate-300/50 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-16 left-4 right-4 md:hidden z-40 p-5 rounded-3xl bg-slate-100/95 border border-slate-200/90 backdrop-blur-2xl space-y-4 shadow-xl"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <Link
              href="/sign-up"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              <span className='text-xs'>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}