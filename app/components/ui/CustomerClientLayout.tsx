'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/shared/store/store';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { IoBriefcase } from 'react-icons/io5';
import { RoleEnum } from '@/shared/enums/roles.enum';
import CustomSelect from './CustomSelect';

interface CustomerClientLayoutProps {
  children: ReactNode;
}

export default function CustomerClientLayout({ children }: CustomerClientLayoutProps) {
  const router = useRouter();
  const helpButtonControls = useAnimation();
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);

  const { session, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const activeRole = session?.active_role?.toLowerCase();
  const isAuthorized = isAuthenticated && session && activeRole === RoleEnum.CUSTOMER;

  useEffect(() => {
    if (!isAuthenticated || !session) {
      router.replace('/log-in');
    } else if (activeRole !== RoleEnum.CUSTOMER) {
      router.replace('/unauthorized');
    }
  }, [session, isAuthenticated, activeRole, router]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent, 
    info: PanInfo
  ) => {
    const screenWidth = window.innerWidth;
    const finalX = info.point.x;

    if (finalX < screenWidth / 2) {
      helpButtonControls.start({ 
        x: -(screenWidth - 220), 
        transition: { type: "spring", stiffness: 250, damping: 25 } 
      });
    } else {
      helpButtonControls.start({ 
        x: 0, 
        transition: { type: "spring", stiffness: 250, damping: 25 } 
      });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-app-background">
        <div className="w-8 h-8 border-4 border-[#00AC72] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-background text-stone-900 flex flex-col items-center">
      {/* Main Content Area */}
      <main className="w-full max-w-520 flex-1 flex-col items-center justify-center mt-10 md:mt-16 relative">
        {children}
      </main>

      {/* Floating Call-to-Action Motion Widget */}
      <motion.button 
        drag
        dragConstraints={{ 
          left: -(typeof window !== 'undefined' ? window.innerWidth - 180 : 300), 
          right: 0, 
          top: -600, 
          bottom: 0 
        }}
        dragElastic={0}
        dragMomentum={true}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
        animate={helpButtonControls}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-15 right-5 z-40 touch-none flex items-center gap-2.5 bg-[#FAF8F5] border border-stone-300/60 pl-3 pr-4 py-2.5 rounded-full shadow-md shadow-stone-900/5 cursor-pointer group hover:border-[#00AC72] hover:bg-white hover:shadow-xl transition-all duration-300 select-none" 
        onClick={() => setIsInvestorModalOpen(true)}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100/70 text-[#00AC72] group-hover:bg-[#00AC72] group-hover:text-white transition-colors duration-300">
          <IoBriefcase className="text-base" />
        </div>

        <div className="flex flex-col text-left items-start pr-1">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-stone-500 leading-none mb-0.5">
            Partnership
          </span>
          <span className="text-xs font-bold text-stone-800 group-hover:text-[#00AC72] transition-colors duration-300">
            Become an Investor
          </span>
        </div>
      </motion.button>

      {/* Integrated Modal Portal Shell */}
      <InvestorModal 
        isOpen={isInvestorModalOpen} 
        onClose={() => setIsInvestorModalOpen(false)} 
      />
    </div>
  );
}

interface InvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function InvestorModal({ isOpen, onClose }: InvestorModalProps) {
  const [targetBracket, setTargetBracket] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Surface Box */}
      <div className="relative bg-[#FAF8F5] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-stone-300/60 flex flex-col gap-4 z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/60 border border-emerald-300/50 text-[10px] font-bold text-[#008A5B] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00AC72] animate-pulse" />
            Exclusive Early Access
          </div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Build Your Private Real Estate Portfolio
          </h2>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Are you looking to invest in high-yield private property and premium real estate development? We are launching our institutional-grade property investment platform soon. Join our priority waitlist to secure allocations in pre-vetted asset tranches before public release.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); console.log("Investor waitlist registered."); onClose(); }} className="flex flex-col gap-3 mt-1">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-stone-700">Company / Investor Name</label>
            {/* Pure white input to create noticeable contrast against the soft modal container */}
            <input 
              type="text" 
              required 
              placeholder="e.g. Acme Capital" 
              className="w-full text-xs p-3 bg-white border border-stone-300/70 rounded-xl outline-none focus:border-[#00AC72] focus:ring-1 focus:ring-[#00AC72]/20 transition-all text-stone-900 placeholder:text-stone-400 shadow-xs" 
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-stone-700">Target Investment Bracket (NGN)</label>
            <CustomSelect
              options={["Under ₦50,000,000", "₦50,000,000 - ₦250,000,000", "₦250,000,000+"]}
              selected={targetBracket}
              onChange={(val) => setTargetBracket(val)}
              defaultValue="Select Investment Capacity"
              className="w-full text-xs bg-white border-stone-300/70 shadow-xs"
            />
          </div>

          <div className="flex gap-2.5 justify-end mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2.5 border border-stone-300/70 bg-white hover:bg-stone-100/80 text-xs font-bold rounded-xl transition-colors text-stone-700 cursor-pointer shadow-xs"
            >
              Maybe Later
            </button>
            <button 
              type="submit" 
              className="px-4 py-2.5 bg-[#00AC72] hover:bg-[#009663] text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-emerald-800/10 cursor-pointer"
            >
              Request Priority Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}