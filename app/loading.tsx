'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Loading() {
  const [dots, setDots] = useState("");

  // Handle the "typing" dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500); // Speed of the dots
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        
        {/* Spinner Container */}
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* This is the part that actually spins */}
          <div className="absolute inset-0 border-6 border-primary-green border-t-transparent rounded-full animate-spin"></div>
          
          {/* This "C" stays perfectly still in the center */}
          <h1 className="text-7xl font-bold text-primary-green select-none">C</h1>
        </div>

        {/* Text with animated dots */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-primary-green font-semibold text-lg min-w-[280px] text-center">
            Connecting you to your next home{dots}
          </p>
          
          {/* Optional: Add a subtle pulse to the whole text line */}
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-1 w-12 bg-primary-green rounded-full"
          />
        </div>
      </div>
    </div>
  );
}