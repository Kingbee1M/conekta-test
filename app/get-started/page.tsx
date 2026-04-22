'use client'

import { FiHome } from "react-icons/fi";
import { TbBuildingSkyscraper } from "react-icons/tb";
import { GrLineChart } from "react-icons/gr";
import { LuHammer } from "react-icons/lu";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

interface BoundedBlobProps {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    activeColor: string;
}

function BoundedBlob({ mouseX, mouseY, activeColor }: BoundedBlobProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const x = useTransform(mouseX, (latestX: number) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        return Math.max(Math.min((latestX - centerX) * 0.15, 35), -35);
    });

    const y = useTransform(mouseY, (latestY: number) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        return Math.max(Math.min((latestY - centerY) * 0.15, 35), -35);
    });

    const smoothX = useSpring(x, { damping: 25, stiffness: 120 });
    const smoothY = useSpring(y, { damping: 25, stiffness: 120 });

    return (
       <div ref={containerRef} className="h-32 w-32 rounded-full border border-black/20  flex items-center justify-center">
            <motion.div 
                style={{ x: smoothX, y: smoothY }}
                animate={{ 
                    backgroundColor: activeColor,
                    // Increased shadow spread to make it glow on a light background
                    boxShadow: `0px 0px 30px 5px ${activeColor}66`, 
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-7 w-7 rounded-full"
            />
        </div>
    );
}

export default function GetStarted () {
    const [activeColor, setActiveColor] = useState("#00AC72");
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

    const options = [
        {icon: <FiHome/>, title: 'Renter / Buyer', desc: 'Find your perfect home with flexible payment options', points: ['Browse Properties', 'Virtual Tours', 'Flexible Payments', 'Property Management',], link: '/sign-up', role: 'tenant', color: '#00AC72'},
        {icon: <TbBuildingSkyscraper/>, title: 'Property Owner / Developer', desc: 'List and manage your properties efficiently', points: ['List Properties','Tenant Management','Analytics Dashboard','Secure Payments',], link: '/sign-up', role: 'landlord', color: '#2476FF'},
        {icon: <GrLineChart/>, title: 'Fractional Investor', desc: 'Start investing in real estate from ₦500,000', points: ['Browse Investments', 'Portfolio Tracking', 'Monthly Returns', 'Low Entry Cost',], link: '/sign-up', role: 'investor', color: '#9E25FE'},
        {icon: <LuHammer/>, title: 'Artisan / Service Provider', desc: 'Connect with property owners and renters', points: ['Get Job Requests', 'Build Portfolio', 'Secure Payments', 'Customer Reviews',], link: '/sign-up', role: 'artisan', color: '#FC5800'},
    ]

    return (
        <section className="relative w-full min-h-screen py-20 flex justify-center items-center overflow-hidden bg-white">


            {/* Tracking Orbs Layer */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute top-[10%] left-[5%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} activeColor={activeColor} /></div>
                <div className="absolute top-[3%] right-[7%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} activeColor={activeColor} /></div>
                <div className="absolute top-[70%] right-[20%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} activeColor={activeColor} /></div>
                <div className="absolute top-[28%] right-[5%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} activeColor={activeColor} /></div>
                <div className="absolute bottom-[35%] left-[5%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} activeColor={activeColor} /></div>
                <div className="absolute bottom-[10%] right-[5%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} activeColor={activeColor} /></div>
                <div className="absolute bottom-[10%] right-[50%]"><BoundedBlob mouseX={mouseX} mouseY={mouseY} activeColor={activeColor} /></div>
                
                {/* Central Glow: Adjusted for white BG */}
                <motion.div 
                    animate={{ backgroundColor: activeColor }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full blur-[160px] opacity-[0.08] transition-colors duration-1000"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-30 px-5 max-w-6xl">
                {options.map((opt, index)=> {
                    const ternant = index === 0;
                    const lord = index === 1;
                    const investor = index === 2;
                    return(
                    <div 
                        key={opt.role}
                        onMouseEnter={() => setActiveColor(opt.color)}
                        onMouseLeave={() => setActiveColor("#00AC72")} 
                        className={`max-w-70 md:max-w-150 shadow-md py-2 md:py-5 px-3 md:px-9 rounded-xl bg-white/80 backdrop-blur-sm flex flex-col gap-5 relative overflow-clip group border-2 transition-all duration-300
                        ${ternant ? 'border-[#00ac738c] hover:border-[#00AC72]' : lord ? 'border-[#2476FF8c] hover:border-[#2476FF]' : investor ? 'border-[#9E25FE8c] hover:border-[#9E25FE]' : 'border-[#FC58008c] hover:border-[#FC5800]'}`}>
                        
                        {/* (rest of your card content) */}
                        <span className={`w-12 h-12 text-white flex justify-center items-center text-2xl rounded-xl
                        ${ternant ? 'bg-[#00AC72]' : lord ? 'bg-[#2476FF]' : investor ? 'bg-[#9E25FE]' : 'bg-[#FC5800]'}`}>{opt.icon}</span>
                        <h2 className="text-xl font-bold">{opt.title}</h2>
                        <p className="text-gray-600 text-sm">{opt.desc}</p>
                        
                        <ul className="space-y-2 mb-6">
                            {opt.points.map((point, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: opt.color}} />
                                {point}
                            </li>
                            ))}
                        </ul>

                        <hr className="border-gray-200 border-[0.5px] w-full"/>

                        <Link 
                            href={`${opt.link}?role=${opt.role}`} 
                            className="flex items-center gap-2 font-bold transition-all hover:gap-3 text-sm"
                            style={{ color: opt.color }}
                        >
                            Get started <GoArrowRight/>
                        </Link>
                    </div>
                )})}
            </div>
        </section>
    )
}