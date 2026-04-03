'use client'
import img from '../../public/png/house.png'
import Image from "next/image"
import hero from '../../public/jpg/hero.webp'
import hero1 from '../../public/jpg/bulding2.webp'
import hero2 from '../../public/jpg/bulding3.webp'
import Button from '@/app/components/ui/Button'
import { RiShiningLine } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingHero() {
    const frames = [hero, hero1, hero2];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % frames.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [frames.length]);
    return (
        <section className="w-full min-h-fit flex flex-col lg:flex-row items-center justify-between gap-48 lg:gap-0 py-30 relative overflow-x-hidden overflow-y-hidden">
                <div className="w-150 h-150 rounded-full absolute -z-30 bg-[#dbede1] -top-70 backdrop-blur-md -left-30" />
                <div className="w-90 h-90 rounded-full absolute -z-30 bg-[#dbede1] -bottom-30 right-100" />
                <div className="bg-white/50 top-0 backdrop-blur-[35px] w-screen h-500 absolute -z-20"/>
            {/* Left Section */}
            <div className="w-full lg:w-1/2 flex items-start flex-col gap-8">
                <div className="flex items-center bg-secondary-green py-1 px-2 rounded-xl gap-2 text-xs ml-5">
                    <Image src={img} alt="house" width={400} height={400} className="w-5"/> 
                    <p>Building Connected Communities</p>
                </div>

                <h1 className="text-6xl">Your Complete Housing Ecosystem in Lagos</h1>

                <p className="w-[95%]">Discover, rent, buy, invest, and manage properties with flexible payment options. From virtual tours to trusted artisans, everything you need for your housing journey.</p>

                <div className="flex flex-col gap-4">
                    <Button
                    size="lg"
                    title="Ai-powered Search" 
                    className="w-2/3"
                    leftSection={<RiShiningLine/>} 
                    rightSection={<GoArrowRight/>} />

                    <p className="text-sm text-[#8a8f8e]">Tell us your needs and let AI find your perfect home</p>

                    <div className="flex items-center gap-2">
                        <Button
                        title="Get Started"
                        rightSection={<GoArrowRight/>}
                        color='white' />

                        <Button
                        variant="outline"
                        title="Broswe Property"
                        color='black'
                        rightSection={<GoArrowRight/>} />
                        </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 relative">
                <p 
                className="absolute bg-white p-4 text-base lg:text-3xl z-20 flex flex-col
                 text-primary-green font-bold w-25 lg:w-41 rounded-lg -top-10 right-0">
                        20,000+ 
                    <span className="text-[10px] lg:text-xs text-text-primary">
                        Happy Users
                    </span>
                </p>
                <p className="absolute bg-white p-4 text-base lg:text-3xl z-20 flex flex-col
                text-primary-green font-bold w-31 lg:w-40 rounded-lg -bottom-5 left-0 lg:-left-5">
                        5,000+ 
                    <span className="text-[10px] lg:text-xs text-text-primary">
                        Properties Listed
                    </span>
                </p>
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                    key={index}
                    initial={{ x: "100%" }} 
                    animate={{ x: "0%" }}
                    exit={{ x: "100%" }}
                    transition={{ 
                        duration: 1.2,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                    className="w-full h-100 lg:h-205 overflow-hidden"
                    >
                    <Image 
                        src={frames[index]} 
                        alt={`Frame ${index + 1}`}
                        priority
                        fill 
                        className="object-fill"
                    />
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}