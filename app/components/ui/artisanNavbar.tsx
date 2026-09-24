'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { AppDispatch } from '@/shared/store/store';
import { logoutUser } from '@/shared/features/auth/auth.action';
import { useToast } from './ToastProvider';
import { 
  Eye, 
  Share2, 
  LogOut, 
  X,
  Menu,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  LayoutDashboard,
  Briefcase,
  Receipt,
  User
} from 'lucide-react';
import logo from '@/public/svg/logo-white.svg';

// Synthesized Web Audio API sound for futuristic/game UI navigation click
const playNavClickSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency pop: starts at 600Hz and drops quickly to 150Hz
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);

    // Quick volume envelope
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Graceful fallback if audio context is blocked
  }
};

// Component to render floating particles that float HIGHER beyond the tab
const ActiveTabParticles = () => {
  const particles = [
    { id: 1, left: '15%', size: 3, duration: 1.6, delay: 0 },
    { id: 2, left: '32%', size: 2, duration: 2.1, delay: 0.3 },
    { id: 3, left: '50%', size: 4, duration: 1.8, delay: 0.6 },
    { id: 4, left: '68%', size: 2.5, duration: 2.4, delay: 0.1 },
    { id: 5, left: '82%', size: 3, duration: 1.9, delay: 0.4 },
    { id: 6, left: '42%', size: 2, duration: 2.2, delay: 0.8 },
  ];

  return (
    // Extended top offset (-top-6) and pointer-events-none so particles float high above the header
    <div className="absolute -top-6 bottom-0 left-0 right-0 pointer-events-none overflow-visible">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: '100%', opacity: 0, scale: 0.5 }}
          animate={{
            y: ['100%', '-60%'], // Travels far higher up above the link
            opacity: [0, 0.9, 0.5, 0],
            scale: [0.5, 1, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          className="absolute bottom-1 rounded-full bg-primary-green shadow-[0_0_8px_rgba(34,197,94,0.9)]"
        />
      ))}
    </div>
  );
};

export default function ArtisanNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const profileData = {
    title: 'Apex Pipeworks & Drainage',
    shareUrl: 'https://conekta-test.vercel.app/artisans/apex-pipeworks-drainage',
  };

  const loginUrl = `/log-in?callbackUrl=${encodeURIComponent(profileData.shareUrl)}`;

  const handleLogout = () => {
    playNavClickSound();
    addToast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      variant: 'success',
    });
    dispatch(logoutUser());
  };

  const handleConfirmPublicRedirect = () => {
    playNavClickSound();
    setIsPublicModalOpen(false);
    router.push(loginUrl);
  };

  const handleCopyLink = async () => {
    playNavClickSound();
    try {
      await navigator.clipboard.writeText(profileData.shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    playNavClickSound();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: profileData.title,
          text: `Check out ${profileData.title} on Conekta`,
          url: profileData.shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error opening native share panel:', error);
        }
      }
    }
  };

  const navLinks = [
    { name: 'Overview', href: '/artisan/overview', icon: LayoutDashboard },
    { name: 'Jobs', href: '/artisan/jobs', icon: Briefcase },
    { name: 'Transactions', href: '/artisan/transactions', icon: Receipt },
    { name: 'Profile', href: '/artisan/profile', icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Link 
              href="/artisan/overview" 
              onClick={playNavClickSound}
              className="flex items-center gap-2"
            >
              <Image src={logo} width={80} height={80} alt="Logo" className="w-6 sm:w-7 h-auto" />
              <span className="font-extrabold text-xs sm:text-sm text-text-primary tracking-tight">
                Conekta
              </span>
            </Link>

            {/* Primary Nav Links (Desktop Only) */}
            <nav className="hidden md:flex items-center gap-1 h-14">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={playNavClickSound}
                    className={`relative flex items-center h-full px-3.5 text-[10px] font-bold transition-colors duration-200 group ${
                      isActive
                        ? 'text-primary-green font-extrabold'
                        : 'text-slate-500 hover:text-text-primary'
                    }`}
                  >
                    {/* GAME UI ACTIVATED STATE EFFECTS */}
                    {isActive && (
                      <>
                        {/* Bottom-to-Top Primary-Green Light Gradient */}
                        <motion.div
                          layoutId="activeNavBg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-t from-primary-green/20 via-primary-green/5 to-transparent pointer-events-none rounded-t-sm"
                          transition={{ duration: 0.2 }}
                        />

                        {/* Floating Upward Particles Effect */}
                        <ActiveTabParticles />

                        {/* Bright Glowing Underline Bar */}
                        <motion.div
                          layoutId="activeNavUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary-green shadow-[0_0_8px_rgba(var(--primary-green-rgb,34,197,94),0.8)] z-20"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      </>
                    )}

                    <span className="relative z-10 text-sm">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop Action Buttons */}
            <button
              type="button"
              onClick={() => {
                playNavClickSound();
                setIsPublicModalOpen(true);
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-300 text-text-primary text-[10px] font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Eye className="w-3 h-3 text-slate-500" />
              <span className="text-sm">Public View</span>
            </button>

            <button 
              type="button" 
              onClick={() => {
                playNavClickSound();
                setIsShareModalOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary-green text-primary-green text-[10px] font-bold hover:bg-tertiary-green transition-colors cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span className="text-sm">Share Profile</span>
            </button>

            {/* Logout Button (Desktop) */}
            <button 
              type="button" 
              onClick={handleLogout}
              aria-label="Log Out"
              title="Log Out"
              className="hidden sm:flex p-1.5 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Mobile Actions Drawer Toggle */}
            <button
              type="button"
              onClick={() => {
                playNavClickSound();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="md:hidden p-1.5 text-slate-600 hover:text-text-primary hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Toggle secondary actions menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-2.5 space-y-1.5 shadow-lg">
            <button
              type="button"
              onClick={() => {
                playNavClickSound();
                setIsMobileMenuOpen(false);
                setIsPublicModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch to Customer View</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playNavClickSound();
                setIsMobileMenuOpen(false);
                setIsShareModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-primary-green text-[10px] font-bold text-primary-green hover:bg-tertiary-green active:scale-[0.99] transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-2 shadow-lg">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={playNavClickSound}
              className={`flex flex-col items-center gap-1 py-1 font-bold transition-all relative ${
                isActive 
                  ? 'text-primary-green' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] leading-none">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* PUBLIC VIEW CONFIRMATION MODAL */}
      {isPublicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[11px] sm:text-xs font-extrabold text-text-primary">Switch to Customer View</h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-500">Role re-authentication required</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playNavClickSound();
                  setIsPublicModalOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-3 sm:py-4 space-y-2">
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                To view your live public page as a potential customer, you must re-authenticate into a customer account role.
              </p>
              <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-[9px] text-slate-500 space-y-0.5">
                <p className="font-bold text-slate-700">What will happen next?</p>
                <p className="leading-normal">
                  You will be safely redirected to the login page with your profile link set as the callback URL.
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playNavClickSound();
                  setIsPublicModalOpen(false);
                }}
                className="w-full sm:w-1/2 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPublicRedirect}
                className="w-full sm:w-1/2 py-2 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white text-[10px] font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Proceed to Login</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE PROFILE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-tertiary-green text-primary-green shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[11px] sm:text-xs font-extrabold text-text-primary">Share Profile</h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-500">Promote your artisan business</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playNavClickSound();
                  setIsShareModalOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-3 sm:py-5 space-y-3">
              <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                Share this direct link with clients or on social media so potential customers can view your services and portfolio directly.
              </p>

              <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-2xl">
                <input
                  type="text"
                  readOnly
                  value={profileData.shareUrl}
                  className="w-full bg-transparent px-2 text-[10px] text-slate-700 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all duration-200 shrink-0 flex items-center gap-1 cursor-pointer ${
                    isCopied
                      ? 'bg-primary-green text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shadow-xs'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-1 flex flex-col gap-1.5">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-2.5 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white text-[10px] font-bold transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Share via device options...
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  playNavClickSound();
                  setIsShareModalOpen(false);
                }}
                className="w-full py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-semibold transition-all duration-200 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}