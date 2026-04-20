'use client'

import { useEffect, useRef, useState } from "react";
import Link from "next/link"
import { GoArrowRight } from "react-icons/go";
import { FiHome } from "react-icons/fi";
import { LuPiggyBank } from "react-icons/lu";
import { GrLineChart } from "react-icons/gr";
import { LuHammer } from "react-icons/lu";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import useOnceInView from "@/lib/hooks";

interface BoundedBlobProps {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    isHovered: boolean;
}

function BoundedBlob({ mouseX, mouseY, isHovered }: BoundedBlobProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const x = useTransform(mouseX, (latestX: number) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        // Sensitivity increased slightly to 0.2 for a more "floaty" feel
        return Math.max(Math.min((latestX - centerX) * 0.2, 35), -35);
    });

    const y = useTransform(mouseY, (latestY: number) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        return Math.max(Math.min((latestY - centerY) * 0.2, 35), -35);
    });

    const smoothX = useSpring(x, { damping: 30, stiffness: 120 });
    const smoothY = useSpring(y, { damping: 30, stiffness: 120 });

    return (
        <motion.div 
            ref={containerRef} 
            animate={{ 
                // When hovered, the container becomes invisible
                borderColor: isHovered ? "rgba(255,255,255,0)" : "rgba(255, 255, 255, 1)",
                backgroundColor: isHovered ? "rgba(0,0,0,0)" : "rgba(255,255,255,0.3)"
            }}
            className="h-28 w-28 rounded-full border flex items-center justify-center transition-colors duration-700"
        >
            <motion.div 
                style={{ x: smoothX, y: smoothY }}
                animate={{
                    // The Orb becomes a glowing star
                    backgroundColor: isHovered ? "#FFFFFF" : "#00AC72",
                    boxShadow: isHovered 
                        ? "0px 0px 20px 4px rgba(255, 255, 255, 0.6), 0px 0px 40px 10px rgba(0, 172, 114, 0.2)" 
                        : "0px 0px 0px rgba(0,0,0,0)",
                    scale: isHovered ? 0.6 : 1
                }}
                className="h-3 w-3 rounded-full"
            />
        </motion.div>
    );
}

export default function EverythingYou() {
    const [isHovered, setIsHovered] = useState(false);
    const { ref, isInView } = useOnceInView();
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const needs = [
        {icon: <FiHome/> , color: '#D0FAE5', text: '#009966',title: 'Find Your Home', desc: 'Browse thousands of properties with advanced filters and virtual tours.', link: 'find-property', linkName: 'Explore Properties'},
        {icon: <LuPiggyBank/> , color: '#DBEAFE', text: '#155DFC',title: 'Flexible Payments', desc: 'Rent-to-own, rent now pay later, or pay in installments - you choose.', link: 'find-property', linkName: 'View Options'},
        {icon: <GrLineChart/> , color: '#F3E8FF', text: '#9810FA',title: 'Invest & Earn', desc: 'Start fractional real estate investing from as low as ₦500,000', link: 'find-property', linkName: 'Start Investing'},
        {icon: <LuHammer/> , color: '#FFEDD4', text: '#F54900',title: 'Trusted Artisans', desc: 'Connect with verified plumbers, electricians, and home service providers.', link: 'find-property', linkName: 'Find Artisans'},
    ]

    return (
        <motion.section 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{ backgroundColor: isHovered ? "#101828" : "#ffffff" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative flex flex-col items-center w-full gap-6 px-5 py-24 overflow-hidden"
        >
            {/* Background Layer: Hidden containers, floating stars */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[15%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} /></div>
                <div className="absolute top-[20%] right-[10%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} /></div>
                <div className="absolute bottom-[15%] left-[8%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} /></div>
                <div className="absolute bottom-[25%] right-[15%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} /></div>
                <div className="absolute top-1/2 left-[45%] opacity-30"><BoundedBlob mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} /></div>
            </div>

            <div className="z-10 flex flex-col items-center gap-6 max-w-6xl">
                <motion.h2 
                    animate={{ color: isHovered ? "#ffffff" : "#000000" }}
                    className="text-2xl lg:text-4xl text-center font-bold tracking-tight"
                >
                    Everything You Need in One Platform
                </motion.h2>
                <motion.p 
                    animate={{ color: isHovered ? "#9ca3af" : "#4b5563" }}
                    className="text-center text-sm lg:text-base max-w-2xl"
                >
                    From property discovery to management, we&apos;ve built a complete ecosystem for your housing needs.
                </motion.p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-12 gap-6 w-full">
                    {needs.map((need, index) => (
                        <motion.div
                            ref={ref}
                            key={index}
                            initial={{ y: 50, opacity: 0 }}
                            animate={isInView ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`relative group flex flex-col items-start gap-4 rounded-xl px-6 py-10 transition-all duration-700 border ${
                                isHovered 
                                ? 'bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl' 
                                : 'bg-white border-gray-200 shadow-sm'
                            }`}
                        >
                            <p className='p-3 text-2xl rounded-lg' style={{ backgroundColor: need.color, color: need.text }}>
                                {need.icon}
                            </p>
                            
                            <motion.h3 
                                animate={{ color: isHovered ? "#ffffff" : "#111827" }}
                                className="text-lg font-bold"
                            >
                                {need.title}
                            </motion.h3>
                            
                            <motion.p 
                                animate={{ color: isHovered ? "#d1d5db" : "#4b5563" }}
                                className="text-sm leading-relaxed"
                            >
                                {need.desc}
                            </motion.p>

                            <Link href={need.link} className="mt-auto flex gap-2 items-center text-primary-green font-bold hover:gap-3 transition-all duration-300">
                                {need.linkName} <GoArrowRight />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    )
}