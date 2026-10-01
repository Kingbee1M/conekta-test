'use client';

import logo from '@/public/svg/logo-outline-white.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/shared/store/store';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/shared/features/auth/auth.action';
import { useState } from 'react';
import Loading from '@/app/loading';
import { motion, AnimatePresence } from 'framer-motion';

// Import the RTK Query hook
import { useGetUnreadCountQuery } from '@/shared/service/notification.socket';

import link1 from '@/public/svg/Template.svg';
import link2 from '@/public/svg/CreditCardOutline.svg';
import link4 from '@/public/svg/Icon.svg';
import link5 from '@/public/svg/iconamoon_profile.svg';
import link6 from '@/public/svg/ph_building-apartment.svg';

import help from '@/public/svg/help.svg';
import logout from '@/public/svg/logout.svg';

// ----------------------------------------------------
// Low-Pitched Web Audio API Synthesized Sound Effects
// ----------------------------------------------------

/** Deep, subtle soft sound on link hover */
const playHoverSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Silent catch if autoplay blocked
  }
};

/** Deep low-bass thump + soft click audio on selection */
const playSelectThumpSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // 1. DEEP THUMP (Sub-bass drop: 75 Hz down to 30 Hz)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(75, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.12);

    subGain.gain.setValueAtTime(0.25, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start();
    subOsc.stop(ctx.currentTime + 0.12);

    // 2. MID TONE CHIME (220 Hz -> 280 Hz)
    const midOsc = ctx.createOscillator();
    const midGain = ctx.createGain();

    midOsc.type = 'triangle';
    midOsc.frequency.setValueAtTime(220, ctx.currentTime);
    midOsc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.08);

    midGain.gain.setValueAtTime(0.05, ctx.currentTime);
    midGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    midOsc.connect(midGain);
    midGain.connect(ctx.destination);

    midOsc.start();
    midOsc.stop(ctx.currentTime + 0.08);
  } catch {
    // Silent catch
  }
};

/** Flowing tiny white triangles animation with higher frequency/density */
function FlowingTriangles() {
  // Increased count and staggered delays for continuous flow
  const particles = [
    { id: 1, top: '20%', delay: 0.0, duration: 1.4 },
    { id: 2, top: '45%', delay: 0.3, duration: 1.6 },
    { id: 3, top: '70%', delay: 0.6, duration: 1.3 },
    { id: 4, top: '30%', delay: 0.8, duration: 1.5 },
    { id: 5, top: '60%', delay: 1.1, duration: 1.4 },
    { id: 6, top: '80%', delay: 0.4, duration: 1.7 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ top: p.top, left: '0%' }}
          animate={{
            x: ['0px', '140px'],
            opacity: [0, 0.8, 0.9, 0],
            scale: [0.5, 0.9, 0.7, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        >
          {/* Tiny White Triangle SVG */}
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
            <polygon points="0,1 7,4 0,7" fill="rgba(255, 255, 255, 0.85)" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

interface ListerSideBarProps {
  onItemClick?: () => void;
}

export default function ListerSideBar({ onItemClick }: ListerSideBarProps) {
  const { listerProfile } = useSelector((state: RootState) => state.auth);

  // Fetch live unread count using RTK Query
  const { data: unreadData } = useGetUnreadCountQuery();
  const unreadInboxCount = unreadData?.count ?? 0;

  const pathname = usePathname();

  const dispatch = useDispatch<AppDispatch>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      playSelectThumpSound();
      setIsLoggingOut(true);
      await dispatch(logoutUser());
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const links = [
    { title: 'Dashboard', link: `/lister-dashboard`, icon: link1, isInbox: false, exact: true },
    { title: 'Properties', link: `/properties`, icon: link6, isInbox: false },
    { title: 'Rented Listings', link: `/rented-listings`, icon: link2, isInbox: false },
    { title: 'Inbox', link: `/inbox`, icon: link4, isInbox: true },
    { title: 'My Profile', link: `/my-profile`, icon: link5, isInbox: false },
  ];

  const links2 = [
    { title: 'Help & Support', link: `/support`, icon: help, isInbox: false },
    { title: 'Log Out', link: '#', icon: logout, isInbox: false },
  ];

  if (!listerProfile) {
    return (
      <div className="py-5 px-3 flex flex-col h-full text-white animate-pulse">
        <div className="mb-8 flex items-center px-5">
          <div className="w-10 h-10 bg-white/20 rounded-lg" />
        </div>
        <div className="space-y-3 px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-white/10 rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoggingOut && <Loading />}

      <div className="py-5 px-3 flex flex-col justify-between h-full text-white overflow-hidden">
        <div className="flex flex-col">
          <div className="mb-8 flex items-center px-5">
            <Image src={logo} alt="logo" width={40} height={40} className="w-10 h-auto" />
          </div>

          <nav className="flex flex-col space-y-2">
            {links.map((link) => {
              const normalizedPath = pathname.replace(/\/$/, '');
              const normalizedLink = link.link.replace(/\/$/, '');

              const isActive = link.exact
                ? normalizedPath === normalizedLink
                : normalizedPath.startsWith(normalizedLink);

              return (
                <motion.div
                  key={link.title}
                  initial={false}
                  animate={{
                    marginLeft: isActive ? 12 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 320,
                    damping: 25,
                  }}
                >
                  <Link
                    href={link.link}
                    onMouseEnter={playHoverSound}
                    onClick={() => {
                      playSelectThumpSound();
                      if (onItemClick) onItemClick();
                    }}
                    className={`relative flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-200 group overflow-hidden ${
                      isActive
                        ? 'bg-green-300/40 font-semibold text-white shadow-md'
                        : 'hover:bg-white/10 text-white/95'
                    }`}
                  >
                    {/* Flowing tiny white triangles animation */}
                    <AnimatePresence>{isActive && <FlowingTriangles />}</AnimatePresence>

                    <div className="flex items-center space-x-3.5 z-10">
                      <Image
                        src={link.icon}
                        alt={link.title}
                        width={20}
                        height={20}
                        className={`w-5 h-5 transition-transform ${
                          isActive ? 'opacity-100 scale-105' : 'opacity-80 group-hover:opacity-100'
                        }`}
                      />
                      <span className="text-sm font-medium tracking-wide group-hover:text-white">
                        {link.title}
                      </span>
                    </div>

                    {link.isInbox && unreadInboxCount > 0 && (
                      <span className="z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow-sm animate-pulse">
                        {unreadInboxCount > 99 ? '99+' : unreadInboxCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        <div>
          <nav className="flex flex-col space-y-2">
            {links2.map((link, index) => {
              const normalizedPath = pathname.replace(/\/$/, '');
              const normalizedLink = link.link.replace(/\/$/, '');
              const isActive = normalizedPath === normalizedLink;
              const isLogoutButton = index === 1;

              return isLogoutButton ? (
                <button
                  key={link.title}
                  type="button"
                  onClick={handleLogout}
                  onMouseEnter={playHoverSound}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-red-600 disabled:opacity-50 active:scale-[0.98] group cursor-pointer text-left"
                >
                  <div className="flex items-center space-x-3.5">
                    <Image
                      src={link.icon}
                      alt={link.title}
                      width={20}
                      height={20}
                      className="w-5 h-5 opacity-80 group-hover:opacity-100"
                    />
                    <span className="text-sm font-medium tracking-wide group-hover:text-white text-white/95">
                      {isLoggingOut ? 'Logging out...' : link.title}
                    </span>
                  </div>
                </button>
              ) : (
                <motion.div
                  key={link.title}
                  initial={false}
                  animate={{
                    marginLeft: isActive ? 12 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 320,
                    damping: 25,
                  }}
                >
                  <Link
                    href={link.link}
                    onMouseEnter={playHoverSound}
                    onClick={() => {
                      playSelectThumpSound();
                      if (onItemClick) onItemClick();
                    }}
                    className={`relative flex items-center justify-between px-4 py-3 rounded-xl transition-colors duration-200 group overflow-hidden ${
                      isActive
                        ? 'bg-green-300/40 font-semibold text-white shadow-md'
                        : 'hover:bg-white/10 text-white/95'
                    }`}
                  >
                    <AnimatePresence>{isActive && <FlowingTriangles />}</AnimatePresence>

                    <div className="flex items-center space-x-3.5 z-10">
                      <Image
                        src={link.icon}
                        alt={link.title}
                        width={20}
                        height={20}
                        className={`w-5 h-5 transition-transform ${
                          isActive ? 'opacity-100 scale-105' : 'opacity-80 group-hover:opacity-100'
                        }`}
                      />
                      <span className="text-sm font-medium tracking-wide group-hover:text-white">
                        {link.title}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}