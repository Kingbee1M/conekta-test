'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/shared/store/store';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { IoBriefcase } from 'react-icons/io5'; // Clean professional suitcase icon for investments
import { RoleEnum } from '@/shared/enums/roles.enum';

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

  // Framer Motion Drag-to-Snap Handler Sequence
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent, 
    info: PanInfo
  ) => {
    const screenWidth = window.innerWidth;
    const finalX = info.point.x;

    if (finalX < screenWidth / 2) {
      // Snap flush left configuration
      helpButtonControls.start({ 
        x: -(screenWidth - 220), 
        transition: { type: "spring", stiffness: 250, damping: 25 } 
      });
    } else {
      // Snap original home position right-5
      helpButtonControls.start({ 
        x: 0, 
        transition: { type: "spring", stiffness: 250, damping: 25 } 
      });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
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
        className="fixed bottom-15 right-5 z-40 touch-none flex items-center gap-2.5 bg-white border border-gray-200 pl-3 pr-4 py-2.5 rounded-full shadow-lg shadow-gray-200/50 cursor-pointer group hover:border-[#00AC72] hover:shadow-xl transition-all duration-300 select-none" 
        onClick={() => setIsInvestorModalOpen(true)}
      >
        {/* Left Icon: Housed in a soft, monochromatic circular badge */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-[#00AC72] group-hover:bg-[#00AC72] group-hover:text-white transition-colors duration-300">
          <IoBriefcase className="text-base" />
        </div>

        {/* Typography Label Context */}
        <div className="flex flex-col text-left items-start pr-1">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 leading-none mb-0.5">
            Partnership
          </span>
          <span className="text-xs font-bold text-gray-800 group-hover:text-[#00AC72] transition-colors duration-300">
            Become an Investor
          </span>
        </div>
      </motion.button>

      {/* Integrated Modal Portal Shell */}
      <InvestorModal 
        isOpen={isInvestorModalOpen} 
        onClose={() => setIsInvestorModalOpen(false)} 
      />
    </>
  );
}


interface InvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function InvestorModal({ isOpen, onClose }: InvestorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      {/* Outer Dismiss Click Wrapper */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Surface Box */}
      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Become a Corporate Partner</h2>
          <p className="text-xs text-gray-500 mt-1">
            Grow your real estate and infrastructure holdings. Apply below to view premium, pre-vetted asset tranches.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); console.log("Investor workspace application pipeline launched."); onClose(); }} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Company / Fund Name</label>
            <input type="text" required placeholder="e.g. Acme Capital Ltd" className="w-full text-sm p-2 border border-gray-300 rounded-lg outline-emerald-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Target Investment Bracket (NGN)</label>
            <select className="w-full text-sm p-2 border border-gray-300 rounded-lg outline-emerald-500 bg-white">
              <option>Under ₦50,000,000</option>
              <option>₦50,000,000 - ₦250,000,000</option>
              <option>₦250,000,000+</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-bold rounded-lg transition-colors text-gray-600"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              Submit Pitch Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}