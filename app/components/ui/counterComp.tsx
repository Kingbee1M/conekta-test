'use client';
import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, useInView, motion } from "framer-motion";

interface CounterProps {
  targetValue: number;
  suffix?: string;
  prefix?: string;
}

export default function Counter({ targetValue, suffix = "", prefix = "" }: CounterProps) {
  const count = useMotionValue(0);
  
  // Transform the raw number into a formatted string (adds commas)
  const rounded = useTransform(count, (latest) => {
    return prefix + Math.floor(latest).toLocaleString() + suffix;
  });
  
  const ref = useRef(null);
  // Trigger animation once when 20% of the component is visible
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, targetValue, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, targetValue, count]);

  return (
    <motion.p ref={ref} className="text-white text-sm lg:text-5xl font-bold">
      {rounded}
    </motion.p>
  );
}