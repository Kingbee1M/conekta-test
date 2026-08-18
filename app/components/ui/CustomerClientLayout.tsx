'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, notFound } from 'next/navigation';
import { RootState } from '@/shared/store/store';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { IoChatbubble } from 'react-icons/io5';
import { RoleEnum } from '@/shared/enums/roles.enum';
import CustomSelect from './CustomSelect';
import HelpPortal from './helpPortal';

interface CustomerClientLayoutProps {
  children: ReactNode;
}

export default function CustomerClientLayout({ children }: CustomerClientLayoutProps) {
  const router = useRouter();
  const helpButtonControls = useAnimation();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [themeColor, setThemeColor] = useState('#00AC72');

  const { session, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const activeRole = session?.active_role?.toLowerCase();
  const isAuthorized = isAuthenticated && session && activeRole === RoleEnum.CUSTOMER;

  useEffect(() => {
    // If not logged in at all, take them to login
    if (!isAuthenticated || !session) {
      router.replace('/log-in');
    }
  }, [session, isAuthenticated, router]);

  // If the user is logged in BUT has the wrong role, trigger 404
  if (session && activeRole !== RoleEnum.CUSTOMER) {
    notFound();
  }

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent, 
    info: PanInfo
  ) => {
    const screenWidth = window.innerWidth;
    const buttonWidth = buttonRef.current?.offsetWidth || 70;
    const padding = 20;

    const leftTargetX = -(screenWidth - buttonWidth - (padding * 2));
    const currentX = info.point.x;

    if (currentX < screenWidth / 2) {
      helpButtonControls.start({ 
        x: leftTargetX, 
        transition: { type: "spring", stiffness: 260, damping: 25 } 
      });
    } else {
      helpButtonControls.start({ 
        x: 0, 
        transition: { type: "spring", stiffness: 260, damping: 25 } 
      });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-linear-to-br from-[#EDFDF5] via-[#EDFDF5] to-white">
        <div className="w-8 h-8 border-4 border-[#00AC72] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-background text-stone-900 flex flex-col items-center">
      {/* Main Content Area */}
      <main className="w-full max-w-520 flex-1 flex-col items-center justify-center relative">
        {children}
      </main>

      {/* Floating Call-to-Action Motion Widget */}
      <HelpPortal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        themeColor={themeColor} 
      />

      {/* FLOATING HELP TRIGGER BUTTON */}
      <motion.button 
  ref={buttonRef}
  drag
  dragElastic={0.1}
  dragConstraints={{ 
    left: -(typeof window !== 'undefined' ? window.innerWidth - 80 : 300), 
    right: 0, 
    top: -600, 
    bottom: 0 
  }}
  animate={helpButtonControls}
  onDragEnd={handleDragEnd}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.92 }}
  className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-2.5 bg-primary-green text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#23703a] border border-white/20 backdrop-blur-sm transition-colors cursor-pointer touch-none select-none" 
  onClick={() => setIsHelpOpen(!isHelpOpen)}
>
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
  </span>

  <span className="text-xs md:text-sm font-semibold tracking-wide">
    Need help?
  </span>

  <IoChatbubble className="text-base md:text-lg text-white" />
</motion.button>
    </div>
  );
}