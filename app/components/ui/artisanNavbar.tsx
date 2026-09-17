'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/shared/store/store';
import { logoutUser } from '@/shared/features/auth/auth.action';
import { useToast } from './ToastProvider';
import { 
  Briefcase, 
  LayoutDashboard, 
  Receipt, 
  User, 
  Eye, 
  Share2, 
  LogOut, 
  Sparkles,
  X,
  Menu,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import logo from '@/public/svg/logo-white.svg';

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
    addToast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      variant: 'success',
    });
    dispatch(logoutUser());
  };

  const handleConfirmPublicRedirect = () => {
    setIsPublicModalOpen(false);
    router.push(loginUrl);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileData.shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/artisan/overview" className="flex items-center gap-2">
              <Image src={logo} width={100} height={100} alt="Logo" className="w-8 sm:w-10 h-auto" />
              <span className="font-extrabold text-base sm:text-lg text-text-primary tracking-tight">
                Propti
              </span>
            </Link>

            {/* Primary Nav Links (Desktop Only) */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-tertiary-green text-secondary-green'
                        : 'text-slate-600 hover:text-text-primary hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                    <span>{link.name}</span>
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
              onClick={() => setIsPublicModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-300 text-text-primary text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Public View</span>
            </button>

            <button 
              type="button" 
              onClick={() => setIsShareModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary-green text-primary-green text-xs font-bold hover:bg-tertiary-green transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Profile</span>
            </button>

            <button 
              type="button" 
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Boost Listing</span>
              <span className="xs:hidden">Boost</span>
            </button>

            {/* Logout Button (Desktop) */}
            <button 
              type="button" 
              onClick={handleLogout}
              aria-label="Log Out"
              title="Log Out"
              className="hidden sm:flex p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Actions Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-text-primary hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Toggle secondary actions menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer (Secondary Actions Only) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPublicModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Switch to Public View</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsShareModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary-green text-xs font-bold text-primary-green hover:bg-tertiary-green active:scale-[0.99] transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Primary Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-2 shadow-lg">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-bold transition-all ${
                isActive ? 'text-primary-green' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* PUBLIC VIEW CONFIRMATION MODAL */}
      {isPublicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-text-primary">Switch to Customer View</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">Role re-authentication required</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublicModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 sm:py-5 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                To view your live public page as a potential customer, you must re-authenticate into a customer account role.
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">What will happen next?</p>
                <p className="leading-normal">
                  You will be safely redirected to the login page with your profile link set as the callback URL.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPublicModalOpen(false)}
                className="w-full sm:w-1/2 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPublicRedirect}
                className="w-full sm:w-1/2 py-2.5 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Proceed to Login</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE PROFILE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-tertiary-green text-primary-green shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-text-primary">Share Profile</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">Promote your artisan business</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 sm:py-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Share this direct link with clients or on social media so potential customers can view your services and portfolio directly.
              </p>

              <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <input
                  type="text"
                  readOnly
                  value={profileData.shareUrl}
                  className="w-full bg-transparent px-2 sm:px-3 text-xs font-mono text-slate-700 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isCopied
                      ? 'bg-primary-green text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shadow-xs'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-3 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Share via device options...
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all duration-200 cursor-pointer"
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