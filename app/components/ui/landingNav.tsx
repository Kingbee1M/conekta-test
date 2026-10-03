'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BadgeCheck, Building2, ChevronDown, CreditCard, KeyRound, Menu, Network, ShieldCheck, Wrench, X } from 'lucide-react';

import logo from '@/public/png/logofinal.png';
import { PRODUCT_FEATURES } from '@/shared/data/productFeatures';

const PRODUCT_ICONS = [Building2, BadgeCheck, ShieldCheck, Wrench, KeyRound, CreditCard, Network];

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMobileMenuOpen]);

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
    { name: 'Impact', href: '/impact' },
    { name: 'Team', href: '/about-us#team' },
    { name: 'Login', href: '/log-in' },
  ];

  return (
    <>
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
              onClick={() => setIsProductsOpen(false)}
              className={`px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-200 ${link.name === 'Home' ? 'order-1' : link.name === 'Impact' ? 'order-3' : link.name === 'Team' ? 'order-4' : 'order-5'}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative order-2">
            <button
              type="button"
              onClick={() => setIsProductsOpen((open) => !open)}
              onKeyDown={(event) => { if (event.key === 'Escape') setIsProductsOpen(false); }}
              aria-expanded={isProductsOpen}
              className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${isProductsOpen ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
            >
              Product <ChevronDown size={14} className={`transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isProductsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-1/2 top-full z-50 mt-3 w-[min(780px,92vw)] -translate-x-1/2 rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_22px_60px_-25px_rgba(15,23,42,0.3)]"
                >
                  <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Explore Conekta</div>
                  <div className="grid grid-cols-3 gap-1">
                    {PRODUCT_FEATURES.map((product, index) => {
                      const Icon = PRODUCT_ICONS[index];
                      return (
                        <Link
                          key={product.slug}
                          href={`/products/${product.slug}`}
                          onClick={() => setIsProductsOpen(false)}
                          className="group flex items-start gap-2.5 rounded-2xl px-3 py-3 transition hover:bg-emerald-50/80"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-primary-green transition group-hover:bg-white group-hover:shadow-sm">
                            <Icon size={17} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-slate-800">{product.title}</span>
                            <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{product.menuDescription}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

    </motion.header>
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          onKeyDown={(event) => { if (event.key === 'Escape') setIsMobileMenuOpen(false); }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-gradient-to-br from-[#eaf8f0] via-white to-[#f0f3ff] md:hidden"
        >
          <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-5 pb-6 pt-5 sm:px-8 sm:pt-8">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5">
                <Image src={logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
                <span className="text-base font-extrabold tracking-[0.14em] text-slate-900">CONEKTA</span>
              </Link>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close navigation" className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white">
                <X size={20} />
              </button>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-green">Navigate</p>
              <nav className="mt-3 grid grid-cols-2 gap-2">
                {navLinks.map((link, index) => (
                  <motion.div key={link.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}>
                    <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex min-h-12 items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 text-sm font-semibold text-slate-700 transition hover:border-primary-green/30 hover:text-primary-green">
                      {link.name}<ArrowRight size={15} className="text-slate-400" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between gap-3">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-green">Explore the platform</p><h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">Products</h2></div>
                <span className="pb-1 text-[10px] font-semibold text-slate-400">{PRODUCT_FEATURES.length} features</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {PRODUCT_FEATURES.map((product, index) => {
                  const Icon = PRODUCT_ICONS[index];
                  return (
                    <motion.div key={product.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + index * 0.045 }}>
                      <Link href={`/products/${product.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="group flex h-full min-h-[106px] flex-col rounded-2xl border border-slate-200/70 bg-white/85 p-3.5 transition hover:-translate-y-0.5 hover:border-primary-green/30 hover:bg-white hover:shadow-md">
                        <span className="mb-2 grid h-8 w-8 place-items-center rounded-xl bg-primary-green/10 text-primary-green transition group-hover:bg-primary-green group-hover:text-white"><Icon size={16} /></span>
                        <span className="text-xs font-bold leading-4 text-slate-800">{product.title}</span>
                        <span className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">{product.menuDescription}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary-green px-5 text-sm font-bold text-white shadow-lg shadow-primary-green/20 transition hover:bg-primary-green-hover">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
