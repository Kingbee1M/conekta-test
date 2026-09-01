'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import AddAdminModalPortal from '../admin/AddAdminModalPortal';

export default function AddAdminFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40">
        <motion.button
          type="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsModalOpen(true)}
          whileTap={{ scale: 0.92 }}
          animate={{
            width: isHovered ? 'auto' : '52px',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          style={{ backgroundColor: 'var(--color-primary-green, #1b5e32)' }}
          className="flex items-center gap-2.5 h-13 px-3.5 rounded-full text-white shadow-lg hover:shadow-xl cursor-pointer overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-green"
        >
          {/* Roll icon rotation effect */}
          <motion.div
            animate={{ rotate: isHovered ? 90 : 0 }}
            transition={{ duration: 0.25 }}
            className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0"
          >
            <FiPlus className="w-5 h-5 text-white" />
          </motion.div>

          {/* Expanded text pill label */}
          <motion.span
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              width: isHovered ? 'auto' : 0,
            }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap font-semibold text-sm pr-2 overflow-hidden select-none"
          >
            Add new admin
          </motion.span>
        </motion.button>
      </div>

      {/* Form Portal */}
      <AddAdminModalPortal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}