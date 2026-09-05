'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { RootState } from '@/shared/store/store';

interface KycModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  kycStatus: string | null;
}

const KycModalContext = createContext<KycModalContextType | undefined>(undefined);

export const KycModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Explicit modal visibility state (defaults to false)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const kycProfile = useSelector((state: RootState) => state.publicKyc.profile);
  const kycStatus = kycProfile?.status ?? null;

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const handleNavigateToVerification = () => {
    closeModal();
    router.push('/verify-account');
  };

  const handleKeyDownBackdrop = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeModal();
    }
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  return (
    <KycModalContext.Provider value={{ isOpen, openModal, closeModal, kycStatus }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with accessibility handlers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              onKeyDown={handleKeyDownBackdrop}
              role="button"
              tabIndex={0}
              aria-label="Close modal backdrop"
              className="absolute inset-0 bg-text-primary/60 backdrop-blur-sm cursor-pointer outline-none"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Background Accent Gradient */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-artisan-orange/10 rounded-full blur-2xl pointer-events-none" />

              {/* Status Warning Badge */}
              <div className="w-16 h-16 rounded-2xl bg-artisan-orange/10 border border-artisan-orange/20 flex items-center justify-center mb-5 text-artisan-orange">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-text-primary mb-2 tracking-tight">
                Account Verification Required
              </h3>

              {/* Description */}
              <p className="text-sm text-[#5f5e5e] mb-6 leading-relaxed">
                Your profile has not been approved for verification yet. Some features will remain locked to you until verification is completed.
              </p>

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                <button
                  type="button"
                  onClick={handleNavigateToVerification}
                  className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-primary-green hover:bg-primary-fixed-dim hover:text-text-primary transition-all duration-200 shadow-md shadow-primary-green/20 active:scale-[0.98]"
                >
                  Verify Account Now
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-3 px-6 rounded-xl font-medium text-xs text-[#5f5e5e] hover:text-[#111] bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Remind Me Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </KycModalContext.Provider>
  );
};

export const useKycModal = () => {
  const context = useContext(KycModalContext);
  if (!context) {
    throw new Error('useKycModal must be used within a KycModalProvider');
  }
  return context;
};