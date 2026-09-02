'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertTriangle, FiLoader, FiTrash2, FiX } from 'react-icons/fi';

interface DeleteListingPortalProps {
  isOpen: boolean;
  listingTitle?: string;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

const CONFIRMATION_TEXT = 'delete listing';

export default function DeleteListingPortal({
  isOpen,
  listingTitle,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteListingPortalProps) {
  const [confirmation, setConfirmation] = useState('');
  const canDelete = confirmation.trim().toLowerCase() === CONFIRMATION_TEXT;

  useEffect(() => {
    if (!isOpen) {
      setConfirmation('');
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDeleting) onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-gray-950/55 px-4 py-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-listing-title"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            <div className="border-b border-red-100 bg-red-50 px-5 py-5 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <FiAlertTriangle className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-600">
                      Danger zone
                    </p>
                    <h2 id="delete-listing-title" className="mt-1 text-lg font-bold text-gray-950">
                      Delete this listing?
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  aria-label="Close delete confirmation"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-white hover:text-gray-900 disabled:opacity-50"
                >
                  <FiX />
                </button>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <p className="text-sm leading-6 text-gray-600">
                This permanently removes{' '}
                <span className="font-semibold text-gray-900">
                  {listingTitle || 'this listing'}
                </span>{' '}
                and cannot be undone.
              </p>

              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-semibold text-gray-700">
                  Type <span className="font-mono text-red-600">delete listing</span> to confirm
                </span>
                <input
                  autoFocus
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  disabled={isDeleting}
                  placeholder="delete listing"
                  className="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm text-gray-900 outline-none transition-all focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:bg-gray-50"
                />
              </label>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="h-10 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={!canDelete || isDeleting}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isDeleting ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                  {isDeleting ? 'Deleting...' : 'Delete listing'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
